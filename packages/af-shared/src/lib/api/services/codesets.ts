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

async function getCodeSetsResponse<T>(resourcePath: string): Promise<T[]> {
  const { data } = await apiClient.get<T[]>(
    `${CODESETS_BASE_URL}/resources/${resourcePath}`,
    {
      isTraceable: true,
    }
  );
  return data;
}

export async function getCountries() {
  return await getCodeSetsResponse<Country>(
    'ISO3166CountriesURL?filters=testbed'
  );
}

export async function getCurrencies() {
  return await getCodeSetsResponse<Currency>('ISO4217Currencies?filters=nsg');
}

export async function getLanguages() {
  return await getCodeSetsResponse<Language>('ISO639Languages');
}

export async function getEscoLanguages() {
  return await getCodeSetsResponse<EscoLanguage>(`EscoLanguages`);
}

export async function getLanguageSkillLevels() {
  return await getCodeSetsResponse<LanguageSkillLevel>('LanguageSkillLevels');
}

export async function getNaceCodes() {
  return await getCodeSetsResponse<Nace>('SuomiFiKoodistotNace');
}

export async function getEducationFields() {
  return await getCodeSetsResponse<EducationField>('EducationFields');
}

export async function getEducationLevels() {
  return await getCodeSetsResponse<EducationLevel>('LevelsOfEducation');
}

export async function getWorkPermits() {
  return await getCodeSetsResponse<WorkPermit>('WorkPermits');
}

export async function getRegions() {
  return await getCodeSetsResponse<Region>('Regions');
}

export async function getMunicipalities() {
  return await getCodeSetsResponse<Municipality>('Municipalities');
}

export async function getOccupationsFlat() {
  return await getCodeSetsResponse<Occupation>('OccupationsFlatURL');
}

export async function getEscoSkills() {
  return await getCodeSetsResponse<EscoSkill>('Skills?locales=en');
}
