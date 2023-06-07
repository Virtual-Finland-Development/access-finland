import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { USERS_API_BASE_URL } from '@shared/lib/api/endpoints';
import { decryptApiAuthPackage } from '../../ApiAuthPackage';

const UsersApiRouter = {
  async execute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
      res.status(405).json({ message: 'Method not allowed' });
    }

    const apiAuthPackage = decryptApiAuthPackage(req.cookies.apiAuthPackage);

    try {
      await axios.delete(`${USERS_API_BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${apiAuthPackage.idToken}`,
          'Content-Type': 'application/json',
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
