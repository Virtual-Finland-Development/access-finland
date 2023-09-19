import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { DataProductShemas, type DataProduct } from '@shared/types';
import { decryptApiAuthPackage } from '../../ApiAuthPackage';
import { getDataProductRoutePath } from './dataspace-settings';

async function execute(
  dataProduct: DataProduct,
  dataSource: string | undefined,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiAuthPackage = decryptApiAuthPackage(req.cookies.apiAuthPackage!);
  const endpointUrl = getDataProductEndpoint(dataProduct, dataSource);
  const requestBody = parseDataProductRequestBody(dataProduct, req);

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
        'User-Agent': 'Access Finland - MVP Application',
      },
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    const statusCode = error.response?.status || 500;

    if (error.response?.data?.type) {
      res.status(statusCode).json({
        message:
          (error.response?.data?.message
            ? `${error.response?.data.type}: ${error.response?.data?.message}`
            : null) ||
          `Data source returned error type: ${error.response?.data?.type}`,
        context: 'DataProductSource',
      });
    } else {
      res
        .status(statusCode)
        .json({ message: error.message, context: 'ApiRouter' });
    }
  }
}

function getDataProductEndpoint(dataProduct: DataProduct, dataSource?: string) {
  const gatewayEndpoint = process.env.TESTBED_PRODUCT_GATEWAY_BASE_URL;
  const defaultDataSource = process.env.TESTBED_DEFAULT_DATA_SOURCE;
  const dataProductRoutePath = getDataProductRoutePath(dataProduct);

  if (!gatewayEndpoint)
    throw new Error('Missing data product gateway endpoint');
  if (!dataSource) dataSource = defaultDataSource;

  return `${gatewayEndpoint}/${dataProductRoutePath}?source=${dataSource}`;
}

function parseDataProductRequestBody(
  dataProduct: DataProduct,
  req: NextApiRequest
) {
  if (req.body) {
    return DataProductShemas[dataProduct].parse(req.body);
  }
  return '{}';
}

const DataProductRouter = { execute };
export default DataProductRouter;
