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
    errorResponse: agreementErrorResponse,
  } = useProfileTosAgreement(!isExport); // enable TOS functionality for MVP only

  // for MVP: data fetch enabled if user has accepted the agreement, for Featues OK
  const shouldFetchProfileData =
    isExport || (!agreementFetching && agreement?.hasAcceptedLatest);

  const {
    data: personBasicInformation,
    isLoading: basicInformationLoading,
    errorResponse: personBasicInfoErrorResponse,
  } = usePersonBasicInfo(shouldFetchProfileData);

  const {
    data: jobApplicationProfile,
    isLoading: jobApplicationProfileLoading,
    errorResponse: jobApplicationProfileErrorResponse,
  } = useJobApplicantProfile(shouldFetchProfileData);

  const isLoading =
    agreementFetching ||
    basicInformationLoading ||
    jobApplicationProfileLoading;

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
          <ProfileDataSentry
            agreement={agreement}
            errorResponses={[
              agreementErrorResponse,
              personBasicInfoErrorResponse,
              jobApplicationProfileErrorResponse,
            ]}
          >
            <ProfileDetails
              personBasicInformation={personBasicInformation}
              jobApplicationProfile={jobApplicationProfile}
            />
          </ProfileDataSentry>
        )}
      </div>
    </Page.Block>
  );
}
