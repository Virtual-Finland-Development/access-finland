import { useQuery } from '@tanstack/react-query';
import { ConsentSituation, ConsentStatus } from '@/types';
import api from '../api';
import useErrorToast from './use-error-toast';

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
    error: query.error,
  });

  return {
    ...query,
    isLoading: query.isLoading && query.fetchStatus !== 'idle',
  };
}

export { usePersonWorkPermits };
