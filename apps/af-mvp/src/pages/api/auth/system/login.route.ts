import type { NextApiRequest, NextApiResponse } from 'next';
import { createApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import { resolveIdTokenExpiresAt } from '@mvp/lib/backend/api-utils';
import { loggedOutAuthMiddleware } from '@mvp/lib/backend/middleware/auth';
import { validateCognitoIdToken } from '@mvp/lib/backend/services/aws/cognito';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { object, parse, string } from 'valibot';
import { AuthProvider } from '@shared/types';

const GoodLoginInput = object({
  idToken: string(),
});

export default loggedOutAuthMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Parse request payload
  const loginInput = parse(GoodLoginInput, req.body);

  // Validate the id token
  await validateCognitoIdToken(loginInput.idToken, {
    userPoolClientId: process.env.NEXT_PUBLIC_LOGIN_SYSTEM_COGNITO_CLIENT_ID!,
    userPoolId: process.env.NEXT_PUBLIC_LOGIN_SYSTEM_COGNITO_USER_POOL_ID!,
  });

  // Decode user info
  const decoded = jwt.decode(loginInput.idToken) as jwt.JwtPayload;
  const userInfo = { email: decoded.email!, userId: decoded.sub! };

  // Create the api auth package
  const apiAuthPackage = await createApiAuthPackage({
    idToken: loginInput.idToken,
    provider: AuthProvider.VIRTUALFINLAND,
    expiresAt: resolveIdTokenExpiresAt(loginInput.idToken),
    profileData: userInfo,
  });

  //
  // Respond with the login session
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
});
