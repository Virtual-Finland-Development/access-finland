import type { NextApiRequest, NextApiResponse } from 'next';
import { decryptApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import authMiddleware from '@mvp/lib/backend/middleware/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiAuthPackage = decryptApiAuthPackage(req.cookies.apiAuthPackage);

  res.status(200).json({
    message: 'Retrieved state successfully.',
    state: apiAuthPackage,
  });
}

export default authMiddleware(handler);
