import { useQuery } from '@tanstack/react-query';
import api from '../api';
import useErrorToast from './use-error-toast';

const OPTIONS = {
  refetchOnWindowFocus: false,
  retry: false,
  cacheTime: Infinity,
  staleTime: 300_000,
};

function useQueryFunction<T>(
  queryKeys: string[],
  apiCall: () => Promise<T>,
  enabled: boolean
) {
  const query = useQuery(queryKeys, apiCall, { ...OPTIONS, enabled });

  useErrorToast({
    title: `Could not fetch codesets: ${queryKeys.join(', ')}`,
    error: query.error,
  });

  return {
    ...query,
    isLoading: query.isLoading && query.fetchStatus !== 'idle',
  };
}

function useCountries(enabled: boolean = true) {
  return useQueryFunction(
    ['countries'],
    async () => await api.codesets.getCountries(),
    enabled
  );
}

function useCurrencies(enabled: boolean = true) {
  return useQueryFunction(
    ['currencies'],
    async () => await api.codesets.getCurrencies(),
    enabled
  );
}

function useLanguages(enabled: boolean = true) {
  return useQueryFunction(
    ['languages'],
    async () => await api.codesets.getLanguages(),
    enabled
  );
}

function useEscoLanguages(enabled: boolean = true) {
  return useQueryFunction(
    ['esco-languages'],
    async () => await api.codesets.getEscoLanguages(),
    enabled
  );
}

function useLanguageSkillLevels(enabled: boolean = true) {
  return useQueryFunction(
    ['language-skill-levels'],
    async () => await api.codesets.getLanguageSkillLevels(),
    enabled
  );
}

function useNaceCodes(enabled: boolean = true) {
  return useQueryFunction(
    ['nace'],
    async () => await api.codesets.getNaceCodes(),
    enabled
  );
}

function useEducationFields(enabled: boolean = true) {
  return useQueryFunction(
    ['education-fields'],
    async () => await api.codesets.getEducationFields(),
    enabled
  );
}

function useEducationLevels(enabled: boolean = true) {
  return useQueryFunction(
    ['education-levels'],
    async () => await api.codesets.getEducationLevels(),
    enabled
  );
}

function useWorkPermits(enabled: boolean = true) {
  return useQueryFunction(
    ['permits'],
    async () => await api.codesets.getWorkPermits(),
    enabled
  );
}

function useRegions(enabled: boolean = true) {
  return useQueryFunction(
    ['regions'],
    async () => await api.codesets.getRegions(),
    enabled
  );
}

function useMunicipalities(enabled: boolean = true) {
  return useQueryFunction(
    ['municipalities'],
    async () => await api.codesets.getMunicipalities(),
    enabled
  );
}

function useOccupations(enabled: boolean = true) {
  return useQueryFunction(
    ['occupations-flat'],
    async () => await api.codesets.getOccupationsFlat(),
    enabled
  );
}

function useEscoSkills(enabled: boolean = true) {
  return useQueryFunction(
    ['esco-skills'],
    async () => await api.codesets.getEscoSkills(),
    enabled
  );
}

export {
  useCountries,
  useCurrencies,
  useLanguages,
  useEscoLanguages,
  useLanguageSkillLevels,
  useNaceCodes,
  useEducationFields,
  useEducationLevels,
  useWorkPermits,
  useRegions,
  useMunicipalities,
  useOccupations,
  useEscoSkills,
};
