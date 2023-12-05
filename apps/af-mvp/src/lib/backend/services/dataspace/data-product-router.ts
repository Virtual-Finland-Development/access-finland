import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import { ValiError } from 'valibot';
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
  const apiAuthPackage = await decryptApiAuthPackage(
    req.cookies.apiAuthPackage!
  );
  const endpoint = getDataProductEndpointInfo(dataProduct, dataSource);

  try {
    const requestBody = parseDataProductRequestBody(dataProduct, req);
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
    const statusCode =
      error.response?.status || (error instanceof ValiError ? 400 : 500);

    const responseData = isDataspaceErrorResponseData(error)
      ? mapDataspaceErrorResponseData(errorContextPostfix, error)
      : { message: error.message, context: `ApiRouter:${errorContextPostfix}` };

    const logLevel = resolveErrorLoggingLevel(
      req.url!,
      statusCode,
      responseData
    );

    logger[logLevel](
      `Data product request failed with code ${statusCode}`,
      responseData
    );

    res.status(statusCode).json(responseData);
  }
}

/**
 * Maps the dataspace error response to the error response data.
 *
 * @param errorContextPostfix
 * @param error
 * @returns
 */
function mapDataspaceErrorResponseData(
  errorContextPostfix: string,
  error: any
) {
  let errorMessage = '';

  if (
    error.response?.status === 422 &&
    error.response?.data?.detail instanceof Array
  ) {
    errorMessage = parseDataspaceErrorMessage(
      error.response?.data.detail.map((detail: any) => {
        return { message: detail.msg, type: detail.type };
      })[0],
      error.response?.status
    );
  } else {
    errorMessage = parseDataspaceErrorMessage(
      error.response?.data,
      error.response?.status
    );
  }

  return {
    message: errorMessage,
    context: `DataProductSource:${errorContextPostfix}`,
  };
}

/**
 * Resolves the error message from the dataspace error response.
 *
 * @param messageObject
 * @param statusCode
 * @returns
 */
function parseDataspaceErrorMessage(messageObject?: any, statusCode?: number) {
  let errorMessage =
    messageObject?.message && messageObject?.type
      ? `${messageObject.type}: ${messageObject?.message}`
      : null;

  if (!errorMessage && messageObject?.message) {
    errorMessage = `Data source returned error message: ${messageObject?.message}`;
  } else if (!errorMessage && messageObject?.type) {
    errorMessage = `Data source returned error type: ${messageObject?.type}`;
  } else if (!errorMessage && statusCode) {
    errorMessage = `Data source returned error code: ${statusCode}`;
  } else if (!errorMessage) {
    errorMessage = 'Data source returned error';
  }
  return errorMessage;
}

/**
 * Recognizes if the error is a type of dataspace error response.
 *
 * @param error
 * @returns
 */
function isDataspaceErrorResponseData(error: any) {
  if (!(error instanceof AxiosError)) return false;

  return (
    typeof error.response?.data?.type === 'string' ||
    (error.response?.status === 422 &&
      error.response?.data?.detail instanceof Array)
  );
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

function resolveErrorLoggingLevel(
  requestUrl: string,
  statusCode: number,
  responseData: { message: any; context: string }
): keyof Pick<Logger, 'error' | 'info'> {
  if (
    statusCode === 404 &&
    [
      '/api/dataspace/Person/BasicInformation',
      '/api/dataspace/Person/JobApplicantProfile',
    ].includes(requestUrl) &&
    responseData.message.includes('NotFound:')
  ) {
    return 'info';
  }

  return 'error';
}

const DataProductRouter = { execute };
export default DataProductRouter;
