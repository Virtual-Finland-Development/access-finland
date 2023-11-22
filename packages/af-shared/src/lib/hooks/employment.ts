import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../api';
import useErrorToast from './use-error-toast';

const CONTRACTS_QUERY_KEYS = ['work-contacts'];
const TAX_QUERY_KEYS = ['income-tax'];

const QUERY_OPTIONS = {
  refetchOnWindowFocus: false,
  retry: false,
};

interface FormattedErrorResponse {
  statusCode: number;
  message: string;
  shouldPrintError: boolean;
}

function formatErrorResponse(
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

/**
 * Get user work contracts
 */
function usePersonWorkContracts(enabled: boolean = true) {
  const query = useQuery(
    CONTRACTS_QUERY_KEYS,
    async () => await api.employment.getPersonWorkContracts(),
    { ...QUERY_OPTIONS, enabled }
  );

  useErrorToast({
    title: 'Could not fetch user work contracts',
    error:
      query.error && (query.error as AxiosError).response?.status !== 404
        ? query.error
        : undefined,
  });

  const errorResponse = formatErrorResponse(query.error, 'Work contacts');

  return {
    ...query,
    errorResponse,
  };
}

/**
 * Get user income tax
 */
function usePersonIncomeTax(enabled: boolean = true) {
  const query = useQuery(
    TAX_QUERY_KEYS,
    async () => await api.employment.getPersonIncomeTax(),
    { ...QUERY_OPTIONS, enabled }
  );

  useErrorToast({
    title: 'Could not fetch user income tax',
    error:
      query.error && (query.error as AxiosError).response?.status !== 404
        ? query.error
        : undefined,
  });

  const errorResponse = formatErrorResponse(query.error, 'Income tax');

  return {
    ...query,
    errorResponse,
  };
}

export type { FormattedErrorResponse };
export { usePersonWorkContracts, usePersonIncomeTax };
