import type { NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(_, res: NextApiResponse) {
  res
    .status(200)
    .setHeader(
      'Set-Cookie',
      cookie.serialize('token', '', {
        path: '/api',
        expires: new Date(0),
      })
    )
    .json({ message: 'Logout successful.' });
}
