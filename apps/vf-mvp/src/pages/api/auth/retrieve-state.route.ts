import type { NextApiRequest, NextApiResponse } from 'next';
import { decryptApiAuthPackage } from '@mvp/lib/backend/ApiAuthPackage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: should be refactore to a shared middleware -->
  if (!req.cookies.apiAuthPackage || !req.headers['x-csrf-token']) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }
  const apiAuthPackage = decryptApiAuthPackage(req.cookies.apiAuthPackage);
  if (req.headers['x-csrf-token'] !== apiAuthPackage.csrfToken) {
    res.status(403).json({ error: 'Forbidden.' });
    return;
  }
  // <--

  res.status(200).json({
    message: 'Retrieved state successfully.',
    state: apiAuthPackage,
  });
}
