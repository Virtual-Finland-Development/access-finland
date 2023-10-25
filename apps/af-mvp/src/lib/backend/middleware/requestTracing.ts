import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../Logger';
import { NextApiHandlerWithLogger } from './requestLogging';

/**
 * Middleware that adds a unique traceId to the request headers and passes it to the logger
 */
export function requestTracingMiddleware(handler: NextApiHandlerWithLogger) {
  return async (req: NextApiRequest, res: NextApiResponse, logger: Logger) => {
    const traceId = uuidv4();
    req.headers['X-Request-Trace-Id'] = traceId;
    logger.setTraceId(traceId); // Pass traceId to logger so it'll show up in logs for the current request
    return await handler(req, res, logger);
  };
}
