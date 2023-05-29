import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cors from 'cors';
import { USERS_API_BASE_URL } from '@shared/lib/api/endpoints';
import { runMiddleware } from '@shared/lib/backend/framework-helpers';

const cors = Cors({
  origin: '*',
  methods: ['DELETE'],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    res.status(405).json({ message: 'Method not allowed' });
  }

  await runMiddleware(req, res, cors);

  try {
    await axios.delete(`${USERS_API_BASE_URL}/user`, {
      headers: req.headers,
    });
    res.status(200).json({ message: 'Deletion successful' });
  } catch (error: any) {
    res.status(error?.response?.status || 500).send({
      error:
        error?.response?.statusText || error?.message || 'Something went wrong',
    });
  }
}
