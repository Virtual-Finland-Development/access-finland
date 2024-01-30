import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ConsentSituation, ConsentStatus } from '@/types';
import api from '../api';
import useErrorToast from './use-error-toast';
import { formatErrorResponse } from './utils';

const CONTRACTS_QUERY_KEYS = ['work-contacts'];
const TAX_QUERY_KEYS = ['income-tax'];

const QUERY_OPTIONS = {
  refetchOnWindowFocus: false,
  retry: false,
};

/**
 * Get user work contracts
 */
function usePersonWorkContracts(
  consentSituation: ConsentSituation | undefined
) {
  const query = useQuery(
    CONTRACTS_QUERY_KEYS,
    async () =>
      await api.employment.getPersonWorkContracts(
        consentSituation?.consentToken
      ),
    {
      ...QUERY_OPTIONS,
      enabled: consentSituation?.consentStatus === ConsentStatus.GRANTED,
    }
  );

  useErrorToast({
    title: 'Could not fetch user work contracts',
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

/**
 * Get person income tax
 */
function usePersonIncomeTax(consentSituation: ConsentSituation | undefined) {
  const query = useQuery(
    TAX_QUERY_KEYS,
    async () =>
      await api.employment.getPersonIncomeTax(consentSituation?.consentToken),
    {
      ...QUERY_OPTIONS,
      enabled: consentSituation?.consentStatus === ConsentStatus.GRANTED,
    }
  );

  useErrorToast({
    title: 'Could not fetch user income tax',
    error:
      query.error && (query.error as AxiosError).response?.status !== 404
        ? query.error
        : undefined,
  });

  const formattedError = formatErrorResponse(query.error, 'Income tax');

  return {
    ...query,
    formattedError,
    isLoading: query.isLoading && query.fetchStatus !== 'idle',
  };
}

export { usePersonWorkContracts, usePersonIncomeTax };
