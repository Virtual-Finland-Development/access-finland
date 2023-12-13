import { AxiosError } from 'axios';

export interface FormattedErrorResponse {
  statusCode: number;
  message: string;
  shouldPrintError: boolean;
}

/**
 *
 * @param error
 * @param messagePrefix
 * @returns FormattedErrorResponse | undefined
 *
 * Format error response coming from dataspace/products (with the exception of TOS requests made to users-api)
 * shouldPrintError can be used to determine if the error should be printed to UI in any shape or form
 * 404 errors should not printed to UI in case of data space products / TOS
 * used in custom react-query hooks
 */
export function formatErrorResponse(
  error: unknown,
  messagePrefix: string
): FormattedErrorResponse | undefined {
  if (!error || !(error instanceof AxiosError)) {
    return undefined;
  }

  const errorResponse = error?.response;

  if (!errorResponse) {
    return undefined;
  }

  const statusCode = errorResponse.status;
  const message = `${messagePrefix}: ${
    errorResponse.statusText || 'something went wrong'
  }`;

  return {
    statusCode,
    message,
    shouldPrintError: statusCode !== 404,
  };
}
