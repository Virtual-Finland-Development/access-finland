import { NextApiRequest, NextApiResponse } from 'next';
import { cognitoVerifyMiddleware } from '@mvp/lib/backend/middleware/cognitoVerifyMiddleware';

/**
 * Verify the cognito access token
 *
 * @param req
 * @param res
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({ message: 'Verified' });
}

export default cognitoVerifyMiddleware(handler);
