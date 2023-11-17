import { NextApiRequest, NextApiResponse } from 'next';
import { decryptUsingBackendSecret } from '@mvp/lib/backend/secrets-and-tokens';
import { validateCognitoAccessToken } from '@mvp/lib/backend/services/aws/cognito';
import cookie from 'cookie';

/**
 * Verify the cognito access token
 *
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Parse and validate
    if (!req.cookies.cognitoVerifyToken) {
      throw new Error('Missing cognitoVerifyToken cookie');
    }
    const verifyToken = decryptUsingBackendSecret<string>(
      req.cookies.cognitoVerifyToken
    );

    await validateCognitoAccessToken(verifyToken);

    // Success
    res.json({ message: 'Verified' });
  } catch (error) {
    // Clear the cognito session cookies
    res
      .setHeader('Set-Cookie', [
        cookie.serialize('cognito-identity.amazonaws.com', '', {
          path: '/',
          expires: new Date(0),
        }),
        cookie.serialize('cognitoVerifyToken', '', {
          path: '/api',
          expires: new Date(0),
        }),
      ])
      .status(401)
      .json({ message: 'Unverified' });
  }
}
