import type { NextApiRequest, NextApiResponse } from 'next';
import { loggedInAuthMiddleware } from '@mvp/lib/backend/middleware/auth';
import { requestTracingMiddleware } from '@mvp/lib/backend/middleware/requestTracing';
import UsersApiRouter from '@mvp/lib/backend/services/users-api/users-api-router';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  return await UsersApiRouter.execute(req, res);
}

export default loggedInAuthMiddleware(requestTracingMiddleware(handler));
