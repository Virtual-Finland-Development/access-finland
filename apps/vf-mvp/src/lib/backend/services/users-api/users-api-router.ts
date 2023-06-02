import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { USERS_API_BASE_URL } from '@shared/lib/api/endpoints';
import { decryptApiAuthPackage } from '../../ApiAuthPackage';
import { getForwardableHeaders } from '../../framework-helpers';

const UsersApiRouter = {
  async execute(req: NextApiRequest, res: NextApiResponse) {
    const apiAuthPackage = await decryptApiAuthPackage(
      req.cookies.apiAuthPackage
    );

    if (req.method !== 'DELETE') {
      res.status(405).json({ message: 'Method not allowed' });
    }

    try {
      await axios.delete(`${USERS_API_BASE_URL}/user`, {
        headers: getForwardableHeaders(req.headers, {
          Authorization: `Bearer ${apiAuthPackage.idToken}`,
        }),
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
