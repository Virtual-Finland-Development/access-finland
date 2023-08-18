import { useQuery } from '@tanstack/react-query';
import api from '../api';
import useErrorToast from './use-error-toast';

const COMPANIES_QUERY_KEYS = ['companies'];
const COMPANY_QUERY_KEY = 'company';
const BENEFICIAL_OWNERS_QUERY_KEY = 'beneficial-owners';
const SIGNATORY_RIGHTS_QUERY_KEY = 'signatory-rights';

/**
 * Get all user companies.
 */
function useCompanies() {
  const query = useQuery(
    COMPANIES_QUERY_KEYS,
    async () => await api.company.getCompanies(),
    {
      refetchOnWindowFocus: false,
    }
  );

  useErrorToast({
    title: 'Could not fetch user companies',
    error: query.error,
  });

  return query;
}

/**
 * Get single company.
 */
function useCompany(nationalIdentifier: string | undefined) {
  const query = useQuery(
    [COMPANY_QUERY_KEY, nationalIdentifier],
    async () => await api.company.getCompany(nationalIdentifier as string),
    {
      enabled: Boolean(nationalIdentifier),
      refetchOnWindowFocus: false,
    }
  );

  useErrorToast({
    title: 'Could not fetch company',
    error: query.error,
  });

  return query;
}

/**
 * Get beneficial owners of a company.
 */
function useBeneficialOwners(nationalIdentifier: string | undefined) {
  const query = useQuery(
    [BENEFICIAL_OWNERS_QUERY_KEY, nationalIdentifier],
    async () =>
      await api.company.getBeneficialOwners(nationalIdentifier as string),
    {
      enabled: Boolean(nationalIdentifier),
      refetchOnWindowFocus: false,
    }
  );

  useErrorToast({
    title: 'Could not fetch beneficial owners',
    error: query.error,
  });

  return query;
}

/**
 * Get signatory rights of a company.
 */
function useSignatoryRights(nationalIdentifier: string | undefined) {
  const query = useQuery(
    [SIGNATORY_RIGHTS_QUERY_KEY, nationalIdentifier],
    async () =>
      await api.company.getSignatoryRights(nationalIdentifier as string),
    {
      enabled: Boolean(nationalIdentifier),
      refetchOnWindowFocus: false,
    }
  );

  useErrorToast({
    title: 'Could not fetch signatory rights',
    error: query.error,
  });

  return query;
}

export { useCompanies, useCompany, useBeneficialOwners, useSignatoryRights };
