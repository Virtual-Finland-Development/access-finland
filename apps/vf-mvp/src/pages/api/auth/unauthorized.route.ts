import type { NextApiResponse } from 'next';

export default function handler(_, res: NextApiResponse) {
  res.status(403).json({ error: 'Unauthorized.' });
}
