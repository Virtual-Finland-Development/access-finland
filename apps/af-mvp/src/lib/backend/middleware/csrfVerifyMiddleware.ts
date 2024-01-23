import { NextApiRequest, NextApiResponse } from 'next';
import { Logger } from '../Logger';
import { verifyCSRFToken } from '../secrets-and-tokens';

export function csrfVerifyMiddleware(handler: NextApiHandlerWithLogger) {
  return async (req: NextApiRequest, res: NextApiResponse, logger: Logger) => {
    try {
      // Parse csrf token from header
      const csrfToken = req.headers['x-csrf-token'] as string;
      // Verify csrf token
      await verifyCSRFToken(csrfToken);
    } catch (e) {
      return res.status(401).json({ message: 'Invalid CSRF token' });
    }

    return handler(req, res, logger);
  };
}
