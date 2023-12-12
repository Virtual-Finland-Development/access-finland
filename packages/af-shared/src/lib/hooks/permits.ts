import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ConsentSituation, ConsentStatus } from '@/types';
import api from '../api';
import useErrorToast from './use-error-toast';
import { formatErrorResponse } from './utils';

const PERMTS_QUERY_KEYS = ['work-permits'];

const QUERY_OPTIONS = {
  refetchOnWindowFocus: false,
  retry: false,
};

/**
 * Get user work permits
 */
function usePersonWorkPermits(consentSituation: ConsentSituation | undefined) {
  const query = useQuery(
    PERMTS_QUERY_KEYS,
    async () =>
      await api.permits.getPersonWorkPermits(consentSituation?.consentToken),
    {
      ...QUERY_OPTIONS,
      enabled: consentSituation?.consentStatus === ConsentStatus.GRANTED,
    }
  );

  useErrorToast({
    title: 'Could not fetch user work permits',
    error:
      query.error && (query.error as AxiosError).response?.status !== 404
        ? query.error
        : undefined,
  });

  const formattedError = formatErrorResponse(query.error, 'Work contacts');

  return {
    ...query,
    formattedError,
    isLoading: query.isLoading && query.fetchStatus !== 'idle',
  };
}

export { usePersonWorkPermits };
