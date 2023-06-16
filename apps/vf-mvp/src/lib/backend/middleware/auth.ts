import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { decryptApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import { AxiosError } from 'axios';

export default function authMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
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

export function authErrorHandlerMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
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
