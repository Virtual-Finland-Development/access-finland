import { IconUserProfile, Text } from 'suomifi-ui-components';
import {
  usePersonBasicInfo,
  useProfileTosAgreement,
} from '@shared/lib/hooks/profile';
import { useAuth } from '@shared/context/auth-context';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import PersonalProfileForm from '@shared/components/pages/profile/personal-profile-form';
import ProfileDataSentry from '@shared/components/pages/profile/profile-data-sentry';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';

export default function PersonalProfilePage() {
  const { isAuthenticated } = useAuth();
  const {
    data: agreement,
    isFetching: agreementFetching,
    formattedError: agreementError,
  } = useProfileTosAgreement(isAuthenticated);

  const shouldFetchProfileData = Boolean(
    !agreementFetching && agreement?.hasAcceptedLatest
  );

  const {
    data: personBasicInformation,
    isLoading: basicInformationLoading,
    formattedError: personBasicInfoError,
  } = usePersonBasicInfo(shouldFetchProfileData);

  const isLoading = agreementFetching || basicInformationLoading;

  const profileErrors = [agreementError, personBasicInfoError].flatMap(
    error => error || []
  );

  return (
    <AuthSentry redirectPath="/profile">
      <Page title="Personal profile">
        <Page.Block className="bg-suomifi-blue-bg-light">
          <div className="flex flex-col gap-6">
            <div className="flex flex-row items-center">
              <IconUserProfile className="h-16 w-16" />
              <CustomHeading variant="h2" suomiFiBlue="dark">
                Your personal profile
              </CustomHeading>
            </div>
            <Text>
              Please choose the best described options of yourself. This
              information is under your control all the time and you will decide
              to whom you want to share it.
            </Text>
          </div>
        </Page.Block>

        <Page.Block className="bg-white">
          {isLoading ? (
            <Loading />
          ) : (
            <ProfileDataSentry agreement={agreement} errors={profileErrors}>
              <PersonalProfileForm
                personBasicInformation={personBasicInformation}
              />
            </ProfileDataSentry>
          )}
        </Page.Block>
      </Page>
    </AuthSentry>
  );
}
