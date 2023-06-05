import type { NextApiRequest, NextApiResponse } from 'next';
import authMiddleware from '@mvp/lib/backend/middleware/auth';
import UsersApiRouter from '@mvp/lib/backend/services/users-api/users-api-router';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  return await UsersApiRouter.execute(req, res);
}

export default authMiddleware(handler);
