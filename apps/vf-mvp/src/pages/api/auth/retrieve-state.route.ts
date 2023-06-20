import type { NextApiRequest, NextApiResponse } from 'next';
import { decryptApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';
import { loggedInAuthMiddleware } from '@mvp/lib/backend/middleware/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiAuthPackage = decryptApiAuthPackage(req.cookies.apiAuthPackage);

  res.status(200).json({
    message: 'Retrieved state successfully.',
    state: {
      expiresAt: apiAuthPackage.expiresAt,
      profileData: apiAuthPackage.profileData,
    },
  });
}

export default loggedInAuthMiddleware(handler);
