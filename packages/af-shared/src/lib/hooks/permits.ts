import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../api';
import useErrorToast from './use-error-toast';

const PERMTS_QUERY_KEYS = ['work-permits'];

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
 * Get user work permits
 */
function usePersonWorkPermits(enabled: boolean = true) {
  const query = useQuery(
    PERMTS_QUERY_KEYS,
    async () => await api.permits.getPersonWorkPermits(),
    { ...QUERY_OPTIONS, enabled }
  );

  useErrorToast({
    title: 'Could not fetch user work permits',
    error:
      query.error && (query.error as AxiosError).response?.status !== 404
        ? query.error
        : undefined,
  });

  const errorResponse = formatErrorResponse(query.error, 'Work permits');

  return {
    ...query,
    isLoading: query.isLoading && query.fetchStatus !== 'idle',
    errorResponse,
  };
}

export type { FormattedErrorResponse };
export { usePersonWorkPermits };
