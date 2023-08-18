import type {
  Country,
  EducationField,
  EducationLevel,
  EscoLanguage,
  EscoSkill,
  JobApplicantProfile,
  Language,
  LanguageSkillLevel,
  Municipality,
  Nace,
  Occupation,
  PersonBasicInformation,
  Region,
  WorkPermit,
} from '@/types';
import {
  EMPLOYMENT_TYPE_LABELS,
  SKILL_LEVEL_LABELS,
  WORKING_TIME_LABELS,
} from '@/lib/constants';

export function mapReadablePersonBasicInfo(
  personBasicInformation: PersonBasicInformation,
  countries: Country[]
) {
  return {
    personalProfile: {
      ...personBasicInformation,
      residency:
        countries?.find(
          c => c.threeLetterISORegionName === personBasicInformation.residency
        )?.englishName || '',
    },
  };
}

interface MapReadableJobApplicationProfileInput {
  jobApplicationProfile: JobApplicantProfile;
  educationFields: EducationField[];
  educationLevels: EducationLevel[];
  escoLanguages: EscoLanguage[];
  languageSkillLevels: LanguageSkillLevel[];
  occupations: Occupation[];
  escoSkills: EscoSkill[];
  naceCodes: Nace[];
  permits: WorkPermit[];
  municipalities: Municipality[];
  regions: Region[];
  languages: Language[];
}

export function mapReadableJobApplicationProfile(
  input: MapReadableJobApplicationProfileInput
) {
  const {
    jobApplicationProfile,
    educationFields,
    educationLevels,
    escoLanguages,
    languageSkillLevels,
    occupations,
    escoSkills,
    naceCodes,
    permits,
    municipalities,
    regions,
    languages,
  } = input;

  const mapped = {
    ...jobApplicationProfile,
    certifications: jobApplicationProfile.certifications.map(
      ({ escoIdentifier, ...rest }) => rest
    ),
    educations: jobApplicationProfile.educations.map(e => ({
      ...e,
      educationField:
        educationFields?.find(ef => ef.codeValue === e.educationField)
          ?.prefLabel.fi || '',
      educationLevel:
        educationLevels?.find(el => el.codeValue === e.educationLevel)
          ?.prefLabel.en || '',
    })),
    languageSkills: jobApplicationProfile.languageSkills.map(l => ({
      languageCode:
        escoLanguages?.find(
          el => el.twoLetterISOLanguageName === l.languageCode
        )?.name || '',
      skillLevel:
        languageSkillLevels?.find(ls => ls.codeValue === l.skillLevel)
          ?.prefLabel.en || '',
    })),
    occupations: jobApplicationProfile.occupations.map(
      ({ escoIdentifier, ...rest }) => ({
        ...rest,
        escoCode:
          occupations?.find(o => o.notation === rest.escoCode)?.prefLabel.en ||
          '',
        workExperience: `${rest.workExperience / 12} years`,
      })
    ),
    otherSkills: jobApplicationProfile.otherSkills.map(s => ({
      escoIdentifier:
        escoSkills?.find(es => es.uri === s.escoIdentifier)?.prefLabel.en || '',
      skillLevel: SKILL_LEVEL_LABELS[s.skillLevel],
    })),
    permits: jobApplicationProfile.permits.map(
      code => permits?.find(p => p.codeValue === code)?.prefLabel.en || ''
    ),
    workPreferences: {
      ...jobApplicationProfile.workPreferences,
      naceCode:
        naceCodes?.find(
          nace =>
            nace.dotNotationCodeValue ===
            jobApplicationProfile.workPreferences.naceCode
        )?.prefLabel.en || '',
      preferredMunicipality:
        jobApplicationProfile.workPreferences.preferredMunicipality
          .map(
            code =>
              municipalities
                ?.find(m => m.Koodi === code)
                ?.Selitteet.find(s => s.Kielikoodi === 'fi')?.Teksti || ''
          )
          .join(', '),
      preferredRegion: jobApplicationProfile.workPreferences.preferredRegion
        .map(code => regions?.find(r => r.code === code)?.label.en || '')
        .join(', '),
      typeOfEmployment:
        EMPLOYMENT_TYPE_LABELS[
          // @ts-ignore
          jobApplicationProfile.workPreferences.typeOfEmployment
        ],
      workingLanguage: jobApplicationProfile.workPreferences.workingLanguage
        .map(
          code =>
            languages?.find(l => l.twoLetterISOLanguageName === code)
              ?.englishName || ''
        )
        .join(', '),
      workingTime:
        WORKING_TIME_LABELS[
          // @ts-ignore
          jobApplicationProfile.workPreferences.workingTime
        ],
    },
  };

  return mapped;
}
