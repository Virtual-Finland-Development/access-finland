import type { NextApiRequest, NextApiResponse } from 'next';
import { createApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import { resolveIdTokenExpiresAt } from '@mvp/lib/backend/api-utils';
import { loggedOutAuthMiddleware } from '@mvp/lib/backend/middleware/auth';
import { validateCognitoIdToken } from '@mvp/lib/backend/services/aws/cognito';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { Output, object, safeParse, string } from 'valibot';

const GoodLoginInput = object({
  idToken: string(),
});

/**
 * Handle a good login response.
 *
 * @param queryParams
 * @param req
 * @param res
 */
async function handleGoodLoginResponse(
  loginInput: Output<typeof GoodLoginInput>,
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate the id token
  await validateCognitoIdToken(loginInput.idToken, {
    userPoolClientId: process.env.NEXT_PUBLIC_LOGIN_SYSTEM_COGNITO_CLIENT_ID!,
    userPoolId: process.env.NEXT_PUBLIC_LOGIN_SYSTEM_COGNITO_USER_POOL_ID!,
  });

  // Get user info
  const decoded = jwt.decode(loginInput.idToken) as jwt.JwtPayload;
  const userInfo = { email: decoded.email!, userId: decoded.sub! };

  // Create the api auth package
  const apiAuthPackage = await createApiAuthPackage({
    idToken: loginInput.idToken,
    expiresAt: resolveIdTokenExpiresAt(loginInput.idToken),
    profileData: userInfo,
  });

  //
  // Setup the login session and redirect to the frontend
  //
  res
    .setHeader('Set-Cookie', [
      cookie.serialize('apiAuthPackage', apiAuthPackage.encrypted, {
        path: '/api',
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(apiAuthPackage.data.expiresAt),
      }),
      cookie.serialize('csrfToken', String(apiAuthPackage.data.csrfToken), {
        // Transfer the csrf token to the frontend with a temporal cookie
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        expires: new Date(Date.now() + 10 * 60 * 1000), // in 10 minutes
      }),
    ])
    .json({ message: 'Login successful' });
}

export default loggedOutAuthMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const goodEvent = safeParse(GoodLoginInput, req.body);
  if (goodEvent.success) {
    return await handleGoodLoginResponse(goodEvent.data, req, res);
  }

  throw new Error('Invalid login');
});
