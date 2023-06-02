import type { NextApiRequest, NextApiResponse } from 'next';
import { createApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import cookie from 'cookie';

type RequestBody = {
  idToken: string;
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
  if (!isValidBody<RequestBody>(req.body, ['idToken'])) {
    return res.status(402);
  }

  const apiAuthPackage = await createApiAuthPackage(req.body.idToken);

  res
    .status(200)
    .setHeader(
      'Set-Cookie',
      cookie.serialize('apiAuthPackage', apiAuthPackage.encrypted, {
        path: '/api',
        httpOnly: true,
        sameSite: 'strict',
        //expires: new Date(parsedTokenExp), // TODO: set expiration from apiAuthPackage.exp
      })
    )
    .json({
      message: 'Login successful.',
      csrfToken: apiAuthPackage.csrfToken,
    });
}
