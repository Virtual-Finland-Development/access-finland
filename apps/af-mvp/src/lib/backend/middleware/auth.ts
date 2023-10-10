import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { decryptApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ValiError } from 'valibot';

export function loggedInAuthMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Logged in check
    if (!req.cookies.apiAuthPackage || !req.headers['x-csrf-token']) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const apiAuthPackage = decryptApiAuthPackage(req.cookies.apiAuthPackage);

    if (req.headers['x-csrf-token'] !== apiAuthPackage.csrfToken) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const traceId = uuidv4();
    req.headers['X-Request-Trace-Id'] = traceId;

    try {
      return await handler(req, res);
    } catch (error) {
      logError(error, traceId);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  };
}

export function loggedOutAuthMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const traceId = uuidv4();
    req.headers['X-Request-Trace-Id'] = traceId;

    try {
      return await handler(req, res);
    } catch (error) {
      logError(error, traceId);
      return res.status(401).json({ error: 'Unauthorized.' });
    }
  };
}

function logError(error: Error, traceId: string) {
  if (error instanceof AxiosError) {
    console.error(
      `Axios: ${error.message}, status code: ${error.response?.status}`
    );
  } else if (error instanceof ValiError) {
    console.error(`Vali: ${error.message}`, JSON.stringify(error.issues));
    console.error(`trace: ${traceId}`);
  } else {
    console.error(error);
    console.error(`trace: ${traceId}`);
  }
}
