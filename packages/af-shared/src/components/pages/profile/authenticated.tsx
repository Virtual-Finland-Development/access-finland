import { Text } from 'suomifi-ui-components';
import {
  useJobApplicantProfile,
  usePersonBasicInfo,
  useProfileTosAgreement,
} from '@/lib/hooks/profile';
import { isExportedApplication } from '@/lib/utils';
import Page from '@/components/layout/page';
import CustomHeading from '@/components/ui/custom-heading';
import Loading from '@/components/ui/loading';
import ProfileDataSentry from './profile-data-sentry';
import ProfileDetails from './profile-details/profile-details';

const isExport = isExportedApplication();

export default function ProfileAuthenticated() {
  const {
    data: agreement,
    isFetching: agreementFetching,
    formattedError: agreementError,
  } = useProfileTosAgreement(!isExport); // enable TOS functionality for MVP only

  // for MVP: data fetch enabled if user has accepted the agreement, for Featues OK
  const shouldFetchProfileData = Boolean(
    isExport || (!agreementFetching && agreement?.hasAcceptedLatest)
  );

  const {
    data: personBasicInformation,
    isLoading: basicInformationLoading,
    formattedError: personBasicInfoError,
  } = usePersonBasicInfo(shouldFetchProfileData);

  const {
    data: jobApplicantProfile,
    isLoading: jobApplicantProfileLoading,
    formattedError: jobApplicantProfileError,
  } = useJobApplicantProfile(shouldFetchProfileData);

  const isLoading =
    agreementFetching || basicInformationLoading || jobApplicantProfileLoading;

  const profileErrors = [
    agreementError,
    personBasicInfoError,
    jobApplicantProfileError,
  ].flatMap(error => error || []);

  return (
    <Page.Block className="bg-white">
      <div className="flex flex-col gap-6 items-start">
        <div className="flex flex-row items-center">
          <CustomHeading variant="h2" suomiFiBlue="dark">
            Profile
          </CustomHeading>
        </div>

        <Text>
          This is your Access Finland profile. Its purpose is to make it easier
          for you to interact with public service providers in Finland.
        </Text>

        {isLoading ? (
          <Loading />
        ) : (
          <ProfileDataSentry agreement={agreement} errors={profileErrors}>
            <ProfileDetails
              personBasicInformation={personBasicInformation}
              jobApplicationProfile={jobApplicantProfile}
            />
          </ProfileDataSentry>
        )}
      </div>
    </Page.Block>
  );
}
