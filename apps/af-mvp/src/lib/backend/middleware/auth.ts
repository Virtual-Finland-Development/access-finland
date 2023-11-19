import type { NextApiRequest, NextApiResponse } from 'next';
import { decryptApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import { AxiosError } from 'axios';
import { ValiError } from 'valibot';
import { Logger } from '../Logger';
import { appRequestMiddleware } from './appRequestMiddleware';

export function loggedInAuthMiddleware(handler: NextApiHandlerWithLogger) {
  return appRequestMiddleware(
    async (req: NextApiRequest, res: NextApiResponse, logger: Logger) => {
      // Logged in check
      if (!req.cookies.apiAuthPackage || !req.headers['x-csrf-token']) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }

      const apiAuthPackage = decryptApiAuthPackage(req.cookies.apiAuthPackage);

      if (req.headers['x-csrf-token'] !== apiAuthPackage.csrfToken) {
        return res.status(403).json({ error: 'Forbidden.' });
      }

      try {
        return await handler(req, res, logger);
      } catch (error) {
        logError(logger, 'loggedInAuthMiddleware', error);
        return res.status(500).json({ error: 'Internal server error.' });
      }
    }
  );
}

export function loggedOutAuthMiddleware(handler: NextApiHandlerWithLogger) {
  return appRequestMiddleware(
    async (req: NextApiRequest, res: NextApiResponse, logger: Logger) => {
      try {
        return await handler(req, res, logger);
      } catch (error) {
        logError(logger, 'loggedOutAuthMiddleware', error);
        return res.status(401).json({ error: 'Unauthorized.' });
      }
    }
  );
}

function logError(logger: Logger, contextName: string, error: Error) {
  if (error instanceof AxiosError) {
    logger.error(
      contextName,
      `Axios: ${error.message}, status code: ${error.response?.status}`
    );
  } else if (error instanceof ValiError) {
    logger.error(
      contextName,
      `Vali: ${error.message}`,
      JSON.stringify(error.issues)
    );
  } else {
    logger.error(contextName, error);
  }
}
