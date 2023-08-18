import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Button } from 'suomifi-ui-components';
import type { JobApplicantProfile, PersonBasicInformation } from '@/types';
import { PROFILE_DATA_LABELS } from '@/lib/constants';
import {
  useCountries,
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
import { useModal } from '@/context/modal-context';
import DangerButton from '@/components/ui/danger-button';
import DetailsExpander from '@/components/ui/details-expander/details-expander';
import Loading from '@/components/ui/loading';
import ProfileDeleteConfirmation from './profile-delete-confirmation';
import {
  mapReadableJobApplicationProfile,
  mapReadablePersonBasicInfo,
} from './utils';

interface Props {
  personBasicInformation: PersonBasicInformation | undefined;
  jobApplicationProfile: JobApplicantProfile | undefined;
}

export default function ProfileDetails(props: Props) {
  const { personBasicInformation, jobApplicationProfile } = props;

  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const shouldFetchCodeSets = Boolean(
    personBasicInformation || jobApplicationProfile
  );

  const { data: countries, isLoading: countriesLoading } =
    useCountries(shouldFetchCodeSets);
  const { data: occupations, isLoading: occupationsLoading } =
    useOccupations(shouldFetchCodeSets);
  const { data: languages, isLoading: languagesLoading } =
    useLanguages(shouldFetchCodeSets);
  const { data: permits, isLoading: permitsLoading } =
    useWorkPermits(shouldFetchCodeSets);
  const { data: regions, isLoading: regionsLoading } =
    useRegions(shouldFetchCodeSets);
  const { data: municipalities, isLoading: municipalitiesLoading } =
    useMunicipalities(shouldFetchCodeSets);
  const { data: escoSkills, isLoading: escoSkillsLoading } =
    useEscoSkills(shouldFetchCodeSets);
  const { data: educationFields, isLoading: educationFieldsLoading } =
    useEducationFields(shouldFetchCodeSets);
  const { data: educationLevels, isLoading: educationLevelsLoading } =
    useEducationLevels(shouldFetchCodeSets);
  const { data: naceCodes, isLoading: naceCodesLoading } =
    useNaceCodes(shouldFetchCodeSets);
  const { data: escoLanguages, isLoading: escoLanguagesLoading } =
    useEscoLanguages(shouldFetchCodeSets);
  const { data: languageSkillLevels, isLoading: languageSkillLevelsLoading } =
    useLanguageSkillLevels(shouldFetchCodeSets);

  const isLoading =
    countriesLoading ||
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

  // map all personBasicInfo values to readable form
  const personBasicInfoMapped = useMemo(() => {
    if (isLoading) return undefined;

    if (personBasicInformation) {
      return mapReadablePersonBasicInfo(
        personBasicInformation,
        countries || []
      );
    }
  }, [countries, isLoading, personBasicInformation]);

  // map all jobApplicationProfile values to readable form
  const jobApplicationProfileMapped = useMemo(() => {
    if (isLoading) return undefined;

    if (jobApplicationProfile) {
      return mapReadableJobApplicationProfile({
        jobApplicationProfile,
        educationFields: educationFields || [],
        educationLevels: educationLevels || [],
        escoLanguages: escoLanguages || [],
        escoSkills: escoSkills || [],
        languages: languages || [],
        languageSkillLevels: languageSkillLevels || [],
        municipalities: municipalities || [],
        naceCodes: naceCodes || [],
        occupations: occupations || [],
        permits: permits || [],
        regions: regions || [],
      });
    }
  }, [
    educationFields,
    educationLevels,
    escoLanguages,
    escoSkills,
    isLoading,
    jobApplicationProfile,
    languageSkillLevels,
    languages,
    municipalities,
    naceCodes,
    occupations,
    permits,
    regions,
  ]);

  // open delete confirmation modal
  const onDelete = () =>
    openModal({
      title: 'Delete profile',
      content: <ProfileDeleteConfirmation onCancel={closeModal} />,
      onClose: closeModal,
      closeOnEsc: false,
    });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <DetailsExpander<{ personalProfile: PersonBasicInformation }>
          title="Personal profile"
          values={personBasicInfoMapped || {}}
          labels={PROFILE_DATA_LABELS}
          hasValues={Boolean(personBasicInformation)}
          showStatusIcons={false}
        >
          <div className="mt-8">
            <Button onClick={() => router.push('/profile/personal-profile')}>
              Edit information
            </Button>
          </div>
        </DetailsExpander>

        <DetailsExpander<JobApplicantProfile>
          title="Working profile"
          values={jobApplicationProfileMapped || {}}
          labels={PROFILE_DATA_LABELS}
          hasValues={Boolean(jobApplicationProfile)}
          showStatusIcons={false}
        >
          <div className="mt-8">
            <Button onClick={() => router.push('/profile/working-profile')}>
              Edit information
            </Button>
          </div>
        </DetailsExpander>
      </div>

      {(personBasicInformation || jobApplicationProfile) && (
        <div className="border-t pt-5 w-full">
          <DangerButton onClick={onDelete}>Delete your profile</DangerButton>
        </div>
      )}
    </>
  );
}
