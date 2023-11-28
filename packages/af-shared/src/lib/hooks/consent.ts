import { useQuery } from '@tanstack/react-query';
import { ConsentDataSource, ConsentSituation } from '@/types';
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

function getConsentStoreKey(dataSource: ConsentDataSource) {
  return `consent-${getEnumKeyFromValue(ConsentDataSource, dataSource)}`;
}

function getStoredConsentToken(dataSource: ConsentDataSource) {
  return JSONSessionStorage.get(getConsentStoreKey(dataSource));
}

async function getConsentSituations(dataSources: ConsentDataSource[]) {
  const situations = await api.consent.checkConsent(
    dataSources.map(dataSource => ({
      uri: dataSource,
      consentToken: getStoredConsentToken(dataSource),
    }))
  );

  if (situations.length > 0) {
    situations.forEach((consentSituation, index) => {
      const consentToken = consentSituation.consentToken;
      const consentStoreKey = getConsentStoreKey(dataSources[index]);
      const storedConsentToken = getStoredConsentToken(dataSources[index]);

      if (consentToken) {
        JSONSessionStorage.set(consentStoreKey, consentToken);
      } else if (storedConsentToken) {
        JSONSessionStorage.remove(consentStoreKey);
      }
    });
  }

  return situations;
}

const CONSENT_CHECK_QUERY_KEYS = ['consent-check'];

const QUERY_OPTIONS = {
  refetchOnWindowFocus: false,
  retry: false,
};

/**
 * Get consent situation for a single data source
 */
function useDataSourceConsent(dataSource: ConsentDataSource) {
  const query = useQuery(
    [...CONSENT_CHECK_QUERY_KEYS, dataSource],
    async () => {
      const situations = await getConsentSituations([dataSource]);
      return situations[0];
    },
    { ...QUERY_OPTIONS, enabled: true }
  );

  useErrorToast({
    title: 'Could not fetch consent',
    error: query.error,
  });

  const giveConsent = async () => {
    if (!query.data) {
      throw new Error('Invalid consent situation');
    }

    api.consent.directToConsentService(query.data);
  };

  return {
    ...query,
    giveConsent,
  };
}

/**
 * Get consent situations for multiple data sources
 */
function useMultipleDataSourceConsents(dataSources: ConsentDataSource[]) {
  const query = useQuery(
    [...CONSENT_CHECK_QUERY_KEYS, ...dataSources],
    () => getConsentSituations(dataSources),
    { ...QUERY_OPTIONS, enabled: true }
  );

  useErrorToast({
    title: 'Could not fetch consents',
    error: query.error,
  });

  const giveConsent = async (consentSituation: ConsentSituation) => {
    api.consent.directToConsentService(consentSituation);
  };

  return {
    ...query,
    giveConsent,
  };
}

export { useDataSourceConsent, useMultipleDataSourceConsents };
