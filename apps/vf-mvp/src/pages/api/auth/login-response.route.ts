import type { NextApiRequest, NextApiResponse } from 'next';
import { createApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import { isLoggedIn } from '@mvp/lib/backend/api-utils';
import { authErrorHandlerMiddleware } from '@mvp/lib/backend/middleware/auth';
import {
  retrieveSinunaTokensWithLoginCode,
  retrieveUserInfoWithAccessToken,
} from '@mvp/lib/backend/services/sinuna/sinuna-requests';
import cookie from 'cookie';

export default authErrorHandlerMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const queryParams = req.query;

  //
  // Validate
  //
  if (queryParams.error) {
    throw new Error(
      `Sinuna: ${queryParams.error}: ${queryParams.error_description}`
    );
  }

  if (isLoggedIn(req)) {
    throw new Error('Already logged in.');
  }

  if (
    typeof queryParams.code !== 'string' ||
    typeof queryParams.state !== 'string'
  ) {
    throw new Error('Received invalid login response from Sinuna.');
  }

  // Ensure the request flow integrity
  if (req.cookies.sinunaCsrf !== queryParams.state) {
    throw new Error('Request flow integrity compromised.');
  }

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
    expiresAt: tokens.expiresAt,
    profileData: userInfo,
  });

  const returnBackUrl = '/auth'; // Static frontends auth handler url
  res
    .setHeader('Set-Cookie', [
      cookie.serialize('apiAuthPackage', apiAuthPackage.encrypted, {
        path: '/api',
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(apiAuthPackage.state.expiresAt),
      }),
      cookie.serialize('csrfToken', String(apiAuthPackage.state.csrfToken), {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(apiAuthPackage.state.expiresAt),
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
