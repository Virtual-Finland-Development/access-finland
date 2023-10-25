import type { NextApiRequest, NextApiResponse } from 'next';
import { Logger } from '@mvp/lib/backend/Logger';
import { loggedInAuthMiddleware } from '@mvp/lib/backend/middleware/auth';
import { requestTracingMiddleware } from '@mvp/lib/backend/middleware/requestTracing';
import UsersApiRouter from '@mvp/lib/backend/services/users-api/users-api-router';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  logger: Logger
) {
  return await UsersApiRouter.execute(req, res, logger);
}

export default loggedInAuthMiddleware(requestTracingMiddleware(handler));
