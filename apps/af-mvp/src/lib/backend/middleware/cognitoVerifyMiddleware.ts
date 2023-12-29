import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import { Logger } from '../Logger';
import { decryptUsingBackendSecret } from '../secrets-and-tokens';
import { validateCognitoIdToken } from '../services/aws/cognito';

/**
 * Middleware to verify the cognito session
 */
export function cognitoVerifyMiddleware(handler: NextApiHandlerWithLogger) {
  return async (req: NextApiRequest, res: NextApiResponse, logger: Logger) => {
    if (!req.cookies.wafCognitoSession) {
      // pass through if waf is not enabled
      return await handler(req, res, logger);
    }

    try {
      // Parse and validate
      if (!req.cookies.cognitoVerify) {
        throw new Error('Missing cognitoVerify cookie');
      }
      const verifyTokenPayload = await decryptUsingBackendSecret(
        req.cookies.cognitoVerify
      );

      await validateCognitoIdToken(verifyTokenPayload.idToken);
      // Success
      return await handler(req, res, logger);
    } catch (error) {
      logger.debug(error);
      // Clear the cognito session cookies
      res
        .setHeader('Set-Cookie', [
          cookie.serialize('cognitoVerify', '', {
            path: '/api',
            expires: new Date(0),
          }),
          cookie.serialize('wafCognitoSession', '', {
            path: '/',
            expires: new Date(0),
          }),
        ])
        .status(401)
        .json({ message: 'Unverified' });
    }
  };
}
