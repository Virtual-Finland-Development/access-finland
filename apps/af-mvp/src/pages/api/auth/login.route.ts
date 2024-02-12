import type { NextApiRequest, NextApiResponse } from 'next';
import { loggedOutAuthMiddleware } from '@mvp/lib/backend/middleware/auth';
import { generateCSRFToken } from '@mvp/lib/backend/secrets-and-tokens';
import { retrieveSinunaLoginUrl } from '@mvp/lib/backend/services/sinuna/sinuna-requests';
import { isSinunaDisabled } from '@mvp/lib/shared/sinuna-status';
import cookie from 'cookie';

export default loggedOutAuthMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (isSinunaDisabled()) {
    const error = 'Sinuna error';
    const desc =
      'Sinuna login service has been disabled. You can use Virtual Finland login service to sign-in.';
    return res.redirect(303, `/auth?error=${error}&error_description=${desc}`);
  }

  const sinunaState = await generateCSRFToken();
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
