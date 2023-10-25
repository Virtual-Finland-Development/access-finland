import type { NextApiRequest, NextApiResponse } from 'next';
import { Logger, createLogger } from '../Logger';

export type NextApiHandlerWithLogger<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  logger?: Logger
) => unknown | Promise<unknown>;

/**
 * Middleware creates a logger instance and passes it to the handler
 */
export function requestLoggingMiddleware(handler: NextApiHandlerWithLogger) {
  return async (req: NextApiRequest, res: NextApiResponse, logger?: Logger) => {
    return await handler(req, res, logger || createLogger());
  };
}
