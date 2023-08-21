import { createApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import { resolveIdTokenExpiresAt } from '@mvp/lib/backend/api-utils';
import { loggedOutAuthMiddleware } from '@mvp/lib/backend/middleware/auth';
import {
  retrieveSinunaTokensWithLoginCode,
  retrieveUserInfoWithAccessToken,
} from '@mvp/lib/backend/services/sinuna/sinuna-requests';
import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { object, parse, string } from 'valibot';

const LoginResponseSchema = object({
  code: string(),
  state: string(),
});

export default loggedOutAuthMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //
  // Parse input
  //
  const queryParams = parse(LoginResponseSchema, req.query);

  //
  // Handle login response
  //
  // Get the token
  const tokens = await retrieveSinunaTokensWithLoginCode(req, queryParams.code);
  // Get user info
  const userInfo = await retrieveUserInfoWithAccessToken(tokens.accessToken);
  // Create the api auth package
  const apiAuthPackage = createApiAuthPackage({
    idToken: tokens.idToken,
    expiresAt: resolveIdTokenExpiresAt(tokens.idToken),
    profileData: userInfo,
  });

  const returnBackUrl = '/auth'; // Static frontends auth handler url
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
      cookie.serialize('sinunaCsrf', '', {
        // Clear the sinunaCsrf cookie
        path: '/api',
        httpOnly: true,
        sameSite: 'lax',
        expires: new Date(),
      }),
    ])
    .redirect(303, returnBackUrl);
});
