import type { NextApiRequest, NextApiResponse } from 'next';
import { generateCSRFToken } from '@mvp/lib/backend/ApiAuthPackage';
import { isLoggedIn } from '@mvp/lib/backend/api-utils';
import { authErrorHandlerMiddleware } from '@mvp/lib/backend/middleware/auth';
import { retrieveSinunaLoginUrl } from '@mvp/lib/backend/services/sinuna/sinuna-requests';
import cookie from 'cookie';

export default authErrorHandlerMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (isLoggedIn(req)) {
    throw new Error('Already logged in.');
  }

  const sinunaState = generateCSRFToken();
  const sinunaLoginUrl = await retrieveSinunaLoginUrl(req, sinunaState);
  res
    .setHeader(
      'Set-Cookie',
      cookie.serialize('sinunaCsrf', sinunaState, {
        path: '/api',
        httpOnly: true,
        sameSite: 'lax',
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      })
    )
    .redirect(303, sinunaLoginUrl.toString());
});
