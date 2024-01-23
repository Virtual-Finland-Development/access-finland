import { NextApiRequest, NextApiResponse } from 'next';
import { csrfVerifyMiddleware } from '@mvp/lib/backend/middleware/csrfVerifyMiddleware';
import cookie from 'cookie';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Parse payload
  const { action, key, value } = req.body;

  // Perform action
  switch (action) {
    case 'set':
      res
        .setHeader('Set-Cookie', [
          cookie.serialize(key, value, {
            path: '/api/auth/system/session',
            httpOnly: true,
            sameSite: 'strict',
          }),
        ])
        .json({});
      break;
    case 'get':
      res.json({ value: req.cookies[key] });
      break;
    case 'remove':
      res
        .setHeader('Set-Cookie', [
          cookie.serialize(key, '', {
            path: '/api/auth/system/session',
            httpOnly: true,
            sameSite: 'strict',
            expires: new Date(0),
          }),
        ])
        .json({});
      break;
    case 'clear':
      const existingCookies = Object.keys(req.cookies);
      res
        .setHeader(
          'Set-Cookie',
          existingCookies.map(cookieName =>
            cookie.serialize(cookieName, '', {
              path: '/api/auth/system/session',
              httpOnly: true,
              sameSite: 'strict',
              expires: new Date(0),
            })
          )
        )
        .json({});
      break;
    default:
      res.status(400).json({ message: 'Invalid action' });
      break;
  }
}

export default csrfVerifyMiddleware(handler);
