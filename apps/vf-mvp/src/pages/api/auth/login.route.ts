import type { NextApiRequest, NextApiResponse } from 'next';
import { LoggedInState } from '@mvp/../../../packages/vf-shared/src/types';
import { createApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import cookie from 'cookie';

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
  if (
    !isValidBody<LoggedInState>(req.body, [
      'idToken',
      'expiresAt',
      'profileData',
    ])
  ) {
    res.status(402).json({
      message: 'Bad request.',
    });
    return;
  }

  const apiAuthPackage = createApiAuthPackage(req.body);

  res
    .status(200)
    .setHeader(
      'Set-Cookie',
      cookie.serialize('apiAuthPackage', apiAuthPackage.encrypted, {
        path: '/api',
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(apiAuthPackage.state.expiresAt),
      })
    )
    .json({
      message: 'Login successful.',
      state: apiAuthPackage.state,
    });
}
