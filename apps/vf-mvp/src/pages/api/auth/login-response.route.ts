import type { NextApiRequest, NextApiResponse } from 'next';
import { createApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
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

  /* if (isLoggedIn(req)) {  // TODO: Implement isLoggedIn check so we can survive from a malfunctional situation
    throw new Error('Already logged in.');
  } */

  if (
    typeof queryParams.code !== 'string' ||
    typeof queryParams.state !== 'string'
  ) {
    throw new Error('Received invalid login response from Sinuna.');
  }

  //
  // Handle login response
  //
  const loginCode = queryParams.code;
  const loginState = queryParams.state; //@TODO validate this state

  // Get the token
  const tokens = await retrieveSinunaTokensWithLoginCode(req, loginCode);
  // Get user info
  const userInfo = await retrieveUserInfoWithAccessToken(tokens.accessToken);
  // Create the api auth package
  const apiAuthPackage = createApiAuthPackage({
    idToken: tokens.idToken,
    expiresAt: tokens.expiresAt,
    profileData: userInfo,
  });

  const returnBackUrl = '/auth'; //@TODO get this from the state

  res
    .setHeader('Set-Cookie', [
      cookie.serialize('apiAuthPackage', apiAuthPackage.encrypted, {
        path: '/api',
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(apiAuthPackage.state.expiresAt),
      }),
      cookie.serialize('authFlowToken', apiAuthPackage.state.csrfToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(apiAuthPackage.state.expiresAt),
      }),
    ])
    .redirect(303, returnBackUrl);
});
