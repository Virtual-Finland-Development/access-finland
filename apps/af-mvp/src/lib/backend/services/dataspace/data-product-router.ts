import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { DataProductShemas, type DataProduct } from '@shared/types';
import { decryptApiAuthPackage } from '../../ApiAuthPackage';
import { Logger } from '../../Logger';

async function execute(
  dataProduct: DataProduct,
  dataSource: string | undefined,
  req: NextApiRequest,
  res: NextApiResponse,
  logger: Logger
) {
  const apiAuthPackage = decryptApiAuthPackage(req.cookies.apiAuthPackage!);
  const endpoint = getDataProductEndpointInfo(dataProduct, dataSource);
  const requestBody = parseDataProductRequestBody(dataProduct, req);

  try {
    const response = await axios.post(endpoint.url.toString(), requestBody, {
      headers: {
        Authorization: `Bearer ${apiAuthPackage.idToken}`,
        'X-Consent-Token': '',
        'Content-Type': 'application/json',
        'User-Agent': 'Access Finland - MVP Application',
      },
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    const errorContextPostfix = `${endpoint.dataProduct}:${endpoint.dataSource}:${endpoint.schemaVersion}`;
    const statusCode = error.response?.status || 500;
    const responseData = error.response?.data?.type
      ? {
          message:
            (error.response?.data?.message
              ? `${error.response?.data.type}: ${error.response?.data?.message}`
              : null) ||
            `Data source returned error type: ${error.response?.data?.type}`,
          context: `DataProductSource:${errorContextPostfix}`,
        }
      : { message: error.message, context: `ApiRouter:${errorContextPostfix}` };

    const logLevel = resolveLoggingLevel(req.url!, statusCode, responseData);

    logger[logLevel](
      `Data product request failed with code ${statusCode}`,
      responseData
    );

    res.status(statusCode).json(responseData);
  }
}

function getDataProductEndpointInfo(
  dataProduct: DataProduct,
  dataSource?: string
) {
  const gatewayEndpoint = process.env.DATASPACE_PRODUCT_GATEWAY_BASE_URL;
  const defaultDataSource = process.env.DATASPACE_DEFAULT_DATA_SOURCE;
  const dataProductPathInfo = getDataProductRoutePath(dataProduct);

  if (!gatewayEndpoint)
    throw new Error('Missing data product gateway endpoint');
  if (!dataSource) dataSource = defaultDataSource;

  return {
    url: new URL(
      `${gatewayEndpoint}/${dataProductPathInfo.path}?source=${dataSource}`
    ),
    dataSource,
    dataProduct,
    schemaVersion: dataProductPathInfo.schemaVersion,
  };
}

function getDataProductRoutePath(dataProduct: DataProduct) {
  if (dataProduct.startsWith('test/')) {
    return {
      path: dataProduct,
      schemaVersion: '',
    };
  }

  const schemaVersion = process.env.DATASPACE_DEFAULT_SCHEMA_VERSION;
  if (typeof schemaVersion !== 'string' || schemaVersion.length < 1) {
    throw new Error(`Invalid schema version: ${schemaVersion}`);
  }

  return {
    path: `${dataProduct}_v${schemaVersion}`,
    schemaVersion,
  };
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

function resolveLoggingLevel(
  requestUrl: string,
  statusCode: number,
  responseData: { message: any; context: string }
): keyof Pick<Logger, 'error' | 'info'> {
  if (statusCode > 404) {
    return 'error';
  } else if (
    statusCode === 404 &&
    [
      '/api/dataspace/Person/BasicInformation',
      '/api/dataspace/Person/JobApplicantProfile',
    ].includes(requestUrl) &&
    responseData.message.includes('NotFound:')
  ) {
    return 'info';
  } else {
    return 'error';
  }
}

const DataProductRouter = { execute };
export default DataProductRouter;
