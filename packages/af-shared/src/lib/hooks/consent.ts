import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ConsentDataSource } from '@/types';
import api from '../api';
import { JSONSessionStorage } from '../utils/JSONStorage';
import useErrorToast from './use-error-toast';

function getEnumKeyFromValue<T extends object>(
  myEnum: T,
  enumValue: T[keyof T]
) {
  const index = Object.values(myEnum).indexOf(enumValue as T[keyof T]);
  return Object.keys(myEnum)[index];
}

async function getConsentSituation(dataSource: ConsentDataSource) {
  const consentStoreKey = `consent-${getEnumKeyFromValue(
    ConsentDataSource,
    dataSource
  )}`;
  const storedConsentToken = JSONSessionStorage.get(consentStoreKey);

  const response = await api.consent.checkConsent(
    dataSource,
    storedConsentToken
  );

  if (response.consentToken) {
    JSONSessionStorage.set(consentStoreKey, response.consentToken);
  } else if (storedConsentToken) {
    JSONSessionStorage.remove(consentStoreKey);
  }

  return response;
}

const CONSENT_CHECK_QUERY_KEYS = ['consent-check'];

const QUERY_OPTIONS = {
  refetchOnWindowFocus: false,
  retry: false,
};

/**
 * Get user consent situation for a given data source
 */
function useDataSourceConsent(dataSourceUri: ConsentDataSource) {
  const query = useQuery(
    [...CONSENT_CHECK_QUERY_KEYS, dataSourceUri],
    () => getConsentSituation(dataSourceUri),
    { ...QUERY_OPTIONS, enabled: true }
  );

  useErrorToast({
    title: 'Could not fetch user data source consent',
    error:
      query.error && (query.error as AxiosError).response?.status !== 404
        ? query.error
        : undefined,
  });

  const giveConsent = async () => {
    if (!query.data) {
      throw new Error('Invalid consent situation');
    }

    api.consent.directToConsentService(query.data);
  };

  const errorResponse = query.error;

  return {
    ...query,
    errorResponse,
    giveConsent,
  };
}

export { useDataSourceConsent };
