import type { NextApiRequest, NextApiResponse } from 'next';
import { createApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import { resolveIdTokenExpiresAt } from '@mvp/lib/backend/api-utils';
import { loggedOutAuthMiddleware } from '@mvp/lib/backend/middleware/auth';
import {
  retrieveSinunaTokensWithLoginCode,
  retrieveUserInfoWithAccessToken,
} from '@mvp/lib/backend/services/sinuna/sinuna-requests';
import cookie from 'cookie';
import { Output, object, safeParse, string } from 'valibot';

const GoodLoginResponseSchema = object({
  code: string(),
  state: string(),
});

const BadLoginResponseSchema = object({
  error: string(),
  error_description: string(),
});

const returnBackUri = '/auth'; // Static frontend auth callback handler uri

/**
 * Handle a good login response.
 *
 * @param queryParams
 * @param req
 * @param res
 */
async function handleGoodLoginResponse(
  queryParams: Output<typeof GoodLoginResponseSchema>,
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the token
  const tokens = await retrieveSinunaTokensWithLoginCode(req, queryParams.code);
  // Get user info
  const userInfo = await retrieveUserInfoWithAccessToken(tokens.accessToken);
  // Create the api auth package
  const apiAuthPackage = await createApiAuthPackage({
    idToken: tokens.idToken,
    expiresAt: resolveIdTokenExpiresAt(tokens.idToken),
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
      cookie.serialize('sinunaCsrf', '', {
        // Clear the sinunaCsrf cookie
        path: '/api',
        httpOnly: true,
        sameSite: 'lax',
        expires: new Date(),
      }),
    ])
    .redirect(303, returnBackUri);
}

/**
 * Handle the bad login response.
 *
 * @param queryParams
 * @param req
 * @param res
 * @returns
 */
function handleBadLoginResponse(
  queryParams: Output<typeof BadLoginResponseSchema>,
  req: NextApiRequest,
  res: NextApiResponse
) {
  //
  // Redirect to the frontend with the error
  //
  return res
    .setHeader('Set-Cookie', [
      cookie.serialize('sinunaCsrf', '', {
        // Clear the sinunaCsrf cookie
        path: '/api',
        httpOnly: true,
        sameSite: 'lax',
        expires: new Date(),
      }),
    ])
    .redirect(
      303,
      `${returnBackUri}?error=${queryParams.error}&error_description=${queryParams.error_description}`
    );
}

export default loggedOutAuthMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Parse the query params
  const goodEvent = safeParse(GoodLoginResponseSchema, req.query);
  if (goodEvent.success) {
    return await handleGoodLoginResponse(goodEvent.data, req, res);
  }

  const badEvent = safeParse(BadLoginResponseSchema, req.query);
  if (badEvent.success) {
    return handleBadLoginResponse(badEvent.data, req, res);
  }

  throw new Error('Invalid login response.');
});
