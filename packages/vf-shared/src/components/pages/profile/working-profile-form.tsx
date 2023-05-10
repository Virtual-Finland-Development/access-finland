import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'suomifi-ui-components';
import { EmploymentType, JobApplicantProfile, WorkingTime } from '@/types';
import api from '@/lib/api';
import { EMPLOYMENT_TYPE_LABELS, WORKING_TIME_LABELS } from '@/lib/constants';
import {
  useEducationFields,
  useEducationLevels,
  useEscoLanguages,
  useEscoSkills,
  useLanguageSkillLevels,
  useLanguages,
  useMunicipalities,
  useNaceCodes,
  useOccupations,
  useRegions,
  useWorkPermits,
} from '@/lib/hooks/codesets';
import { JOB_APPLICATION_QUERY_KEYS } from '@/lib/hooks/profile';
import { nullifyUndefinedValues } from '@/lib/utils';
import { useToast } from '@/context/toast-context';
import FormMultiSelect from '@/components/form/form-multi-select';
import FormSingleSelect from '@/components/form/form-single-select';
import CustomHeading from '@/components/ui/custom-heading';
import Loading from '@/components/ui/loading';
import CertificationsSelect from './certifications-select/certifications-select';
import EducationsSelect from './educations-select/educations-select';
import IndustrySelect from './industry-select/industry-select';
import LanguageSkillsSelect from './language-skills-select/language-skills-select';
import OccupationsSelect from './occupations-select/occupations-select';
import OtherSkillsSelect from './other-skills-select/other-skills-select';

const DEFAUT_VALUES = {
  occupations: [],
  educations: [],
  languageSkills: [],
  otherSkills: [],
  certifications: [],
  permits: [],
  workPreferences: {
    naceCode: null,
    preferredRegion: [],
    preferredMunicipality: [],
    typeOfEmployment: null,
    workingTime: null,
    workingLanguage: [],
  },
};

interface Props {
  jobApplicationProfile: JobApplicantProfile | undefined;
}

export default function WorkingProfileForm(props: Props) {
  const { jobApplicationProfile } = props;
  const toast = useToast();
  const reactQueryClient = useQueryClient();
  const router = useRouter();

  const { data: occupations, isLoading: occupationsLoading } = useOccupations();
  const { data: languages, isLoading: languagesLoading } = useLanguages();
  const { data: permits, isLoading: permitsLoading } = useWorkPermits();
  const { data: regions, isLoading: regionsLoading } = useRegions();
  const { data: municipalities, isLoading: municipalitiesLoading } =
    useMunicipalities();
  const { data: escoSkills, isLoading: escoSkillsLoading } = useEscoSkills();
  const { data: educationFields, isLoading: educationFieldsLoading } =
    useEducationFields();
  const { data: educationLevels, isLoading: educationLevelsLoading } =
    useEducationLevels();
  const { data: naceCodes, isLoading: naceCodesLoading } = useNaceCodes();
  const { data: escoLanguages, isLoading: escoLanguagesLoading } =
    useEscoLanguages();
  const { data: languageSkillLevels, isLoading: languageSkillLevelsLoading } =
    useLanguageSkillLevels();

  const isLoading =
    occupationsLoading ||
    languagesLoading ||
    permitsLoading ||
    regionsLoading ||
    municipalitiesLoading ||
    escoSkillsLoading ||
    educationFieldsLoading ||
    educationLevelsLoading ||
    naceCodesLoading ||
    escoLanguagesLoading ||
    languageSkillLevelsLoading;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = useForm<JobApplicantProfile>({
    defaultValues: jobApplicationProfile
      ? jobApplicationProfile
      : DEFAUT_VALUES,
  });

  const {
    occupations: userOccupations,
    workPreferences,
    languageSkills,
    educations,
    otherSkills,
    certifications,
  } = watch();

  const permitOptions = useMemo(() => {
    if (!permits) return [];
    return permits.map(p => ({
      labelText: p.prefLabel.en,
      uniqueItemId: p.codeValue,
    }));
  }, [permits]);

  const languageOptions = useMemo(() => {
    if (!languages) return [];
    return languages.map(c => ({
      labelText: c.englishName,
      uniqueItemId: c.twoLetterISOLanguageName,
    }));
  }, [languages]);

  const regionOptions = useMemo(() => {
    if (!regions) return [];
    return regions.map(r => ({
      labelText: r.label.en,
      uniqueItemId: r.code,
    }));
  }, [regions]);

  const municipalityOptions = useMemo(() => {
    if (!municipalities) return [];
    return municipalities.map(m => ({
      labelText: m.Selitteet.find(s => s.Kielikoodi === 'en')?.Teksti || '',
      uniqueItemId: m.Koodi,
    }));
  }, [municipalities]);

  const onSubmit: SubmitHandler<JobApplicantProfile> = async values => {
    try {
      // save profile and update profile data in react-query
      const payload = nullifyUndefinedValues(values);
      const response = await api.profile.saveJobApplicantProfile(payload);
      reactQueryClient.setQueryData(JOB_APPLICATION_QUERY_KEYS, response);
      toast({
        status: 'neutral',
        title: 'Success',
        content: 'Profile information saved successfully!',
      });
    } catch (error: any) {
      toast({
        status: 'error',
        title: 'Error',
        content: error?.message || 'Something went wrong.',
      });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <CustomHeading variant="h2" suomiFiBlue="dark">
            Work preferences
          </CustomHeading>
          <div className="flex flex-col gap-4 items-start">
            <FormSingleSelect
              name={`workPreferences.typeOfEmployment`}
              control={control}
              labelText="Preferred type of employment"
              items={Object.keys(EmploymentType)
                .filter((key: any) => !isNaN(Number(EmploymentType[key])))
                .map(type => ({
                  labelText:
                    EMPLOYMENT_TYPE_LABELS[
                      type as keyof typeof EMPLOYMENT_TYPE_LABELS
                    ],
                  uniqueItemId: type,
                }))}
            />
            <FormSingleSelect
              name={`workPreferences.workingTime`}
              control={control}
              labelText="Preferred working time"
              items={Object.keys(WorkingTime)
                .filter(key => key.length === 2)
                .map(type => ({
                  labelText:
                    WORKING_TIME_LABELS[
                      type as keyof typeof WORKING_TIME_LABELS
                    ],
                  uniqueItemId: type,
                }))}
            />
            <FormMultiSelect
              name={'workPreferences.workingLanguage'}
              control={control}
              labelText="Working languages"
              items={languageOptions}
              fullWidthChipList
            />
            <FormMultiSelect
              name={`workPreferences.preferredRegion`}
              control={control}
              labelText="Preferred regions to work in"
              items={regionOptions}
              fullWidthChipList
            />
            <FormMultiSelect
              name={`workPreferences.preferredMunicipality`}
              control={control}
              labelText="Preferred municipalities to work in"
              items={municipalityOptions}
              fullWidthChipList
            />
            <IndustrySelect
              userNaceCode={workPreferences?.naceCode}
              naceCodes={naceCodes || []}
              onSelect={selected => {
                setValue(
                  'workPreferences.naceCode',
                  selected?.dotNotationCodeValue || null,
                  { shouldDirty: true }
                );
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <CustomHeading variant="h2" suomiFiBlue="dark">
            Occupational and skill information
          </CustomHeading>
          <div className="flex flex-col gap-4 items-start">
            <OccupationsSelect
              userOccupations={userOccupations}
              occupations={occupations || []}
              onSelect={selected =>
                setValue('occupations', selected, { shouldDirty: true })
              }
            />
            <EducationsSelect
              userEducations={educations}
              educationFields={educationFields || []}
              educationLevels={educationLevels || []}
              onSelect={selected =>
                setValue('educations', selected, { shouldDirty: true })
              }
            />
            <CertificationsSelect
              userCertifications={certifications}
              escoSkills={escoSkills || []}
              onSelect={selected =>
                setValue('certifications', selected, { shouldDirty: true })
              }
            />
            <LanguageSkillsSelect
              userLanguages={languageSkills}
              escoLanguages={escoLanguages || []}
              languageSkillLevels={languageSkillLevels || []}
              onSelect={selected =>
                setValue('languageSkills', selected, { shouldDirty: true })
              }
            />
            <OtherSkillsSelect
              userOtherSkills={otherSkills}
              escoSkills={escoSkills || []}
              onSelect={selected =>
                setValue('otherSkills', selected, { shouldDirty: true })
              }
            />
            <FormMultiSelect
              name={'permits'}
              control={control}
              labelText="Your acquired permits"
              items={permitOptions}
              fullWidthChipList
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-3 mt-6">
        <Button
          variant="secondary"
          icon="arrowLeft"
          onClick={() => router.push('/profile')}
        >
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
}
