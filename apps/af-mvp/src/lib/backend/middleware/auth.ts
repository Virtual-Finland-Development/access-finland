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

    // request tracing
    let traceId: string | undefined = undefined;
    // trace ID can't be set for dataspace request headers, may be blocked
    // header is not merged in data-product-router.ts, this is for additional safety and to prevent polluting logs with untraceable request ids (dataspace requests)
    if (!req.url?.includes('/api/dataspace/')) {
      traceId = uuidv4();
      req.headers['X-Request-Trace-Id'] = traceId;
    }

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
    try {
      return await handler(req, res);
    } catch (error) {
      logError(error);
      return res.status(401).json({ error: 'Unauthorized.' });
    }
  };
}

function logError(error: Error, traceId?: string) {
  if (traceId) {
    console.error(`trace: ${traceId}`);
  }

  if (error instanceof AxiosError) {
    console.error(
      `Axios: ${error.message}, status code: ${error.response?.status}`
    );
  } else if (error instanceof ValiError) {
    console.error(`Vali: ${error.message}`, JSON.stringify(error.issues));
  } else {
    console.error(error);
  }
}
