import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import {
  ProfileTosAgreementSchema,
  ProfileTosAgreementWriteSchema,
} from '@shared/types';
import { USERS_API_BASE_URL } from '@shared/lib/api/endpoints';
import { decryptApiAuthPackage } from '../../ApiAuthPackage';
import { USERS_API_ACCESS_KEY } from '../../api-constants';

const UsersApiRouter = {
  async execute(req: NextApiRequest, res: NextApiResponse) {
    try {
      const apiAuthPackage = decryptApiAuthPackage(req.cookies.apiAuthPackage!);
      const usersApiRequestHeaders = {
        Authorization: `Bearer ${apiAuthPackage.idToken}`,
        'Content-Type': 'application/json',
        'X-Api-Key': USERS_API_ACCESS_KEY,
      };

      switch (`${req.method} ${req.url}`) {
        case 'DELETE /api/users-api/user':
          return await UsersApiRouter.deleteUser(
            req,
            res,
            usersApiRequestHeaders
          );
        case 'GET /api/users-api/terms-of-service':
          // Prevent cloudfront caching of the GET-response
          // @see: https://nextjs.org/docs/pages/api-reference/next-config-js/headers#cache-control
          res.setHeader('Cache-Control', 'no-store');

          return await UsersApiRouter.retrieveTermsOfService(
            req,
            res,
            usersApiRequestHeaders
          );
        case 'POST /api/users-api/terms-of-service':
          return await UsersApiRouter.acceptTermsOfService(
            req,
            res,
            usersApiRequestHeaders
          );
        default:
          res.status(405).json({ message: 'Method not allowed' });
      }
    } catch (error: any) {
      console.error(error);
      res.status(error?.response?.status || 500).send({
        error:
          error?.response?.statusText ||
          error?.message ||
          'Something went wrong',
      });
    }
  },

  async deleteUser(_: NextApiRequest, res: NextApiResponse, headers: object) {
    await axios.delete(`${USERS_API_BASE_URL}/user`, {
      headers,
    });
    res.status(200).json({ message: 'Deletion successful' });
  },

  async retrieveTermsOfService(
    req: NextApiRequest,
    res: NextApiResponse,
    headers: object
  ) {
    const response = await axios.get(
      `${USERS_API_BASE_URL}/user/terms-of-service-agreement`,
      {
        headers,
      }
    );
    const responseBody = ProfileTosAgreementSchema.parse(response.data);
    res.status(200).json(responseBody);
  },

  async acceptTermsOfService(
    req: NextApiRequest,
    res: NextApiResponse,
    headers: object
  ) {
    const requestBody = ProfileTosAgreementWriteSchema.parse(req.body);
    const response = await axios.post(
      `${USERS_API_BASE_URL}/user/terms-of-service-agreement`,
      requestBody,
      {
        headers,
      }
    );
    const responseBody = ProfileTosAgreementSchema.parse(response.data);
    res.status(200).json(responseBody);
  },
};

export default UsersApiRouter;
