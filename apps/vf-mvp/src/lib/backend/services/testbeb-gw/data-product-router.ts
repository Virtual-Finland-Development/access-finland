import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import type { DataProduct } from '@shared/types';
import { USERS_API_BASE_URL } from '@shared/lib/api/endpoints';
import { getForwardableHeaders } from '../../framework-helpers';

const ENV = process.env.NODE_ENV;
const defaultDataSource = 'virtualfinland:development'; // <--- stage arg should be read from env possibly, for now development suffices
const profileProductsEndpoint =
  ENV === 'development'
    ? `${USERS_API_BASE_URL}/productizer`
    : 'https://gateway.testbed.fi';

const testbedGWConfiguration: {
  dataProducts: Record<
    DataProduct,
    { gatewayEndpoint: string; defaultDataSource: string }
  >;
} = {
  dataProducts: {
    'draft/Person/BasicInformation': {
      gatewayEndpoint: profileProductsEndpoint,
      defaultDataSource,
    },
    'draft/Person/BasicInformation/Write': {
      gatewayEndpoint: profileProductsEndpoint,
      defaultDataSource,
    },
    'draft/Person/JobApplicantProfile': {
      gatewayEndpoint: profileProductsEndpoint,
      defaultDataSource,
    },
    'draft/Person/JobApplicantProfile/Write': {
      gatewayEndpoint: profileProductsEndpoint,
      defaultDataSource,
    },
  },
};

const DataProductRouter = {
  async execute(
    dataProduct: DataProduct,
    dataSource: string | undefined,
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const endpointUrl = this.getDataProductEndpoint(dataProduct, dataSource);

    if (!endpointUrl) {
      res.status(400).json({ message: 'Bad request: data product' });
      return;
    }

    try {
      const response = await axios.post(endpointUrl, req.body, {
        headers: getForwardableHeaders(req.headers, {
          'Content-Type': 'application/json',
        }),
      });
      res.status(response.status).json(response.data);
    } catch (error: any) {
      const serializedError =
        error?.response?.data?.error || error?.response?.data;

      if (serializedError.status) {
        res.status(serializedError.status).json({
          message:
            serializedError?.title ||
            `Data source returned: ${serializedError.status}`,
          data: error.response.data,
          context: 'DataProductSource',
        });
      } else {
        res
          .status(error?.response?.status || 500)
          .json({ message: error.message, context: 'ApiRouter' });
      }
    }
  },

  getDataProductEndpoint(dataProduct: DataProduct, dataSource?: string) {
    const dataProductConfig = testbedGWConfiguration.dataProducts[dataProduct];

    if (dataProductConfig) {
      const { gatewayEndpoint, defaultDataSource } = dataProductConfig;
      if (!dataSource) dataSource = defaultDataSource;

      return `${gatewayEndpoint}/${dataProduct}?source=${dataSource}`;
    }

    return null;
  },
};

export default DataProductRouter;
