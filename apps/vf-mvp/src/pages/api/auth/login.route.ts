import type { NextApiRequest, NextApiResponse } from 'next';
import { authErrorHandlerMiddleware } from '@mvp/lib/backend/middleware/auth';
import { retrieveSinunaLoginUrl } from '@mvp/lib/backend/services/sinuna/sinuna-requests';

export default authErrorHandlerMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /* if (isLoggedIn(req)) {  // TODO: Implement isLoggedIn check so we can survive from a malfunctional situation
    throw new Error('Already logged in.');
  } */
  const sinunaLoginUrl = await retrieveSinunaLoginUrl(req);
  res.redirect(303, sinunaLoginUrl.toString());
});
