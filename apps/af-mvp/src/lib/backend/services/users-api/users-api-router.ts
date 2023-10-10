import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { USERS_API_BASE_URL } from '@shared/lib/api/endpoints';
import { decryptApiAuthPackage } from '../../ApiAuthPackage';
import { USERS_API_ACCESS_KEY } from '../../api-constants';

const UsersApiRouter = {
  async execute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
      res.status(405).json({ message: 'Method not allowed' });
    }

    const apiAuthPackage = decryptApiAuthPackage(req.cookies.apiAuthPackage!);

    try {
      await axios.delete(`${USERS_API_BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${apiAuthPackage.idToken}`,
          'Content-Type': 'application/json',
          'X-Api-Key': USERS_API_ACCESS_KEY,
          'x-request-trace-id': uuidv4(),
        },
      });
      res.status(200).json({ message: 'Deletion successful' });
    } catch (error: any) {
      res.status(error?.response?.status || 500).send({
        error:
          error?.response?.statusText ||
          error?.message ||
          'Something went wrong',
      });
    }
  },
};

export default UsersApiRouter;
