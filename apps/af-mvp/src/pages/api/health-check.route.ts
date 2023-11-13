import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'OK' });
}
export default handler;
