import type {
  Country,
  Currency,
  EducationField,
  EducationLevel,
  EscoLanguage,
  EscoSkill,
  Language,
  LanguageSkillLevel,
  Municipality,
  Nace,
  Occupation,
  Region,
  WorkPermit,
} from '@/types';
import apiClient from '../api-client';
import { CODESETS_BASE_URL } from '../endpoints';

export async function getCountries(): Promise<Country[]> {
  const { data } = await apiClient.get(
    `${CODESETS_BASE_URL}/resources/ISO3166CountriesURL?filters=testbed`
  );
  return data;
}

export async function getCurrencies(): Promise<Currency[]> {
  const { data } = await apiClient.get(
    `${CODESETS_BASE_URL}/resources/ISO4217Currencies?filters=nsg`
  );
  return data;
}

export async function getLanguages(): Promise<Language[]> {
  const { data } = await apiClient.get(
    `${CODESETS_BASE_URL}/resources/ISO639Languages`
  );
  return data;
}

export async function getEscoLanguages(): Promise<EscoLanguage[]> {
  const { data } = await apiClient.get(
    `${CODESETS_BASE_URL}/resources/EscoLanguages`
  );
  return data;
}

export async function getLanguageSkillLevels(): Promise<LanguageSkillLevel[]> {
  const { data } = await apiClient.get(
    `${CODESETS_BASE_URL}/resources/LanguageSkillLevels`
  );
  return data;
}

export async function getNaceCodes(): Promise<Nace[]> {
  const { data } = await apiClient.get(
    `${CODESETS_BASE_URL}/resources/SuomiFiKoodistotNace`
  );
  return data;
}

export async function getEducationFields(): Promise<EducationField[]> {
  const { data } = await apiClient.get(
    `${CODESETS_BASE_URL}/resources/EducationFields`
  );
  return data;
}

export async function getEducationLevels(): Promise<EducationLevel[]> {
  const { data } = await apiClient.get(
    `${CODESETS_BASE_URL}/resources/LevelsOfEducation`
  );
  return data;
}

export async function getWorkPermits(): Promise<WorkPermit[]> {
  const { data } = await apiClient.get(
    `${CODESETS_BASE_URL}/resources/WorkPermits`
  );
  return data;
}

export async function getRegions(): Promise<Region[]> {
  const { data } = await apiClient.get(
    `${CODESETS_BASE_URL}/resources/Regions`
  );
  return data;
}

export async function getMunicipalities(): Promise<Municipality[]> {
  const { data } = await apiClient.get(
    `${CODESETS_BASE_URL}/resources/Municipalities`
  );
  return data;
}

export async function getOccupationsFlat(): Promise<Occupation[]> {
  const { data } = await apiClient.get(
    `${CODESETS_BASE_URL}/resources/OccupationsFlatURL`
  );
  return data;
}

export async function getEscoSkills(): Promise<EscoSkill[]> {
  const { data } = await apiClient.get(
    `${CODESETS_BASE_URL}/resources/Skills?locales=en`
  );
  return data;
}
