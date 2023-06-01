import type { NextApiRequest, NextApiResponse } from 'next';
import UsersApiRouter from '@mvp/lib/backend/services/users-api/users-api-router';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await UsersApiRouter.execute(req, res);
}
