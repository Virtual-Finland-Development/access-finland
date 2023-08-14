import type { DataProduct } from '@shared/types';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { decryptApiAuthPackage } from '../../ApiAuthPackage';

const gatewayEndpoint = process.env.TESTBED_PRODUCT_GATEWAY_BASE_URL;
const defaultDataSource = process.env.TESTBED_DEFAULT_DATA_SOURCE;

const testbedGWConfiguration: {
  dataProducts: Record<
    DataProduct,
    { gatewayEndpoint: string; defaultDataSource: string }
  >;
} = {
  dataProducts: {
    'draft/Person/BasicInformation': {
      gatewayEndpoint: gatewayEndpoint,
      defaultDataSource,
    },
    'draft/Person/BasicInformation/Write': {
      gatewayEndpoint: gatewayEndpoint,
      defaultDataSource,
    },
    'draft/Person/JobApplicantProfile': {
      gatewayEndpoint: gatewayEndpoint,
      defaultDataSource,
    },
    'draft/Person/JobApplicantProfile/Write': {
      gatewayEndpoint: gatewayEndpoint,
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
    const apiAuthPackage = decryptApiAuthPackage(req.cookies.apiAuthPackage);
    const endpointUrl = this.getDataProductEndpoint(dataProduct, dataSource);
    const requestBody = req.body || '{}';

    if (!endpointUrl) {
      res.status(400).json({ message: 'Bad request: data product' });
      return;
    }

    try {
      const response = await axios.post(endpointUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${apiAuthPackage.idToken}`,
          'X-Consent-Token': '',
          'Content-Type': 'application/json',
        },
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
