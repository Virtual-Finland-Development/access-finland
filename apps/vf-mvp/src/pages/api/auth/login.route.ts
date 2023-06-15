import type { NextApiRequest, NextApiResponse } from 'next';
import { isLoggedIn } from '@mvp/lib/backend/api-utils';
import { authErrorHandlerMiddleware } from '@mvp/lib/backend/middleware/auth';
import { retrieveSinunaLoginUrl } from '@mvp/lib/backend/services/sinuna/sinuna-requests';

export default authErrorHandlerMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //
  // Validate
  //
  if (isLoggedIn(req)) {
    throw new Error('Already logged in.');
  }

  //
  // Handle login
  //
  const sinunaLoginUrl = await retrieveSinunaLoginUrl(req);
  res.redirect(303, sinunaLoginUrl.toString());
});
