import type { NextApiRequest, NextApiResponse } from 'next';
import { retrieveSinunaLoginUrl } from '@mvp/lib/backend/services/sinuna/sinuna-requests';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sinunaLoginUrl = await retrieveSinunaLoginUrl(req);
  res.redirect(303, sinunaLoginUrl.toString());
}
