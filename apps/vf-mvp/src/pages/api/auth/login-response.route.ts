import type { NextApiRequest, NextApiResponse } from 'next';
import { createApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import {
  getSinunaTokensWithLoginCode,
  getUserInfoWithAccessToken,
} from '@mvp/lib/backend/services/sinuna/sinuna-requests';
import cookie from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const queryParams = req.query;

  if (queryParams.error) {
    throw new Error(
      `Sinuna: ${queryParams.error}: ${queryParams.error_description}`
    ); //@TODO handle this error
  }

  if (
    typeof queryParams.code !== 'string' ||
    typeof queryParams.state !== 'string'
  ) {
    throw new Error('Received invalid login response from Sinuna.'); //@TODO handle this error
  }

  const loginCode = queryParams.code;
  const loginState = queryParams.state; //@TODO validate this state

  // Get the token
  const tokens = await getSinunaTokensWithLoginCode(loginCode);
  // Get user info
  const userInfo = await getUserInfoWithAccessToken(tokens.accessToken);
  // Create the api auth package
  const apiAuthPackage = createApiAuthPackage({
    idToken: tokens.idToken,
    expiresAt: tokens.expiresAt,
    profileData: userInfo,
  });

  const returnBackUrl = '/'; //@TODO get this from the state

  res
    .setHeader(
      'Set-Cookie',
      cookie.serialize('apiAuthPackage', apiAuthPackage.encrypted, {
        path: '/api',
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(apiAuthPackage.state.expiresAt),
      })
    )
    .redirect(303, returnBackUrl);
}
