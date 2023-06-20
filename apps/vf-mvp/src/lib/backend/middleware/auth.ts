import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { decryptApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import { AxiosError } from 'axios';

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

    return handler(req, res);
  };
}

export function loggedOutAuthMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Logged out check
      if (!!req.cookies.apiAuthPackage) {
        throw new Error('Already logged in.');
      }
      return await handler(req, res);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          `Axios: ${error.message}, status code: ${error.response?.status}`
        );
      } else {
        console.error(error);
      }
      return res.status(401).json({ error: 'Unauthorized.' });
    }
  };
}
