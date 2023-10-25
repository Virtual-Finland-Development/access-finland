import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import logger from '../logger';

/**
 * Middleware that adds a unique traceId to the request headers and passes it to the logger
 */
export function requestTracingMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const traceId = uuidv4();
    req.headers['X-Request-Trace-Id'] = traceId;
    logger.setTraceId(traceId); // Pass traceId to logger so it'll show up in logs for the current request
    return await handler(req, res);
  };
}
