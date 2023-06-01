import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

type RequestBody = {
  token: string;
};

function isValidBody<T extends Record<string, unknown>>(
  body: any,
  fields: (keyof T)[]
): body is T {
  return Object.keys(body).every(key => fields.includes(key));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isValidBody<RequestBody>(req.body, ['token'])) {
    return res.status(402);
  }

  res
    .status(200)
    .setHeader(
      'Set-Cookie',
      cookie.serialize('token', req.body.token, {
        path: '/api',
        httpOnly: true,
        sameSite: true,
      })
    )
    .json({ message: 'Login successful.' });
}
