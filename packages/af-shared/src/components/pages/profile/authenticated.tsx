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
    isLoading: agreementLoading,
    errorResponse: agreementErrorResponse,
  } = useProfileTosAgreement(!isExport); // enable TOS functionality for MVP only

  // for MVP: data fetch enabled if user has accepted the agreement, for Featues OK
  const shouldFetchProfileData = !!agreement?.accepted || isExport;

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
    agreementLoading || basicInformationLoading || jobApplicationProfileLoading;

  return (
    <Page.Block className="bg-white">
      <div className="flex flex-col gap-6 items-start">
        <div className="flex flex-row items-center">
          <CustomHeading variant="h2" suomiFiBlue="dark">
            Profile
          </CustomHeading>
        </div>

        <Text>
          Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
          tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
          ea commodi consequat. Quis aute iure reprehenderit in voluptate velit
          esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat
          cupiditat non proident, sunt in culpa qui officia deserunt mollit anim
          id est laborum.
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
