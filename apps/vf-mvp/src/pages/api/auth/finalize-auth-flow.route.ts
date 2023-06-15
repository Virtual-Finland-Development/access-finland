import type { NextApiRequest, NextApiResponse } from 'next';
import { authErrorHandlerMiddleware } from '@mvp/lib/backend/middleware/auth';
import cookie from 'cookie';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.cookies.csrfToken) {
    throw new Error('Bad auth finalizing call.');
  }

  const csrfToken = req.cookies.csrfToken;
  return res
    .setHeader(
      'Set-Cookie',
      cookie.serialize('csrfToken', '', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(),
      })
    )
    .status(200)
    .json({
      message: 'Retrieved auth flow token successfully.',
      csrfToken: csrfToken,
    });
}

export default authErrorHandlerMiddleware(handler);
