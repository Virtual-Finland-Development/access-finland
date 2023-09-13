import { IconUserBadge } from 'suomifi-ui-components';
import { Text } from 'suomifi-ui-components';
import {
  useJobApplicantProfile,
  useProfileTosAgreement,
} from '@shared/lib/hooks/profile';
import { useAuth } from '@shared/context/auth-context';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import ProfileDataSentry from '@shared/components/pages/profile/profile-data-sentry';
import WorkingProfileForm from '@shared/components/pages/profile/working-profile-form';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';

export default function WorkingProfilePage() {
  const { isAuthenticated } = useAuth();
  const {
    data: agreement,
    isFetching: agreementFetching,
    errorResponse: agreementErrorResponse,
  } = useProfileTosAgreement(isAuthenticated);

  const shouldFetchProfileData = !agreementFetching && agreement?.accepted;

  const {
    data: jobApplicationProfile,
    isLoading: jobApplicationProfileLoading,
    errorResponse: jobApplicationProfileErrorResponse,
  } = useJobApplicantProfile(shouldFetchProfileData);

  const isLoading = agreementFetching || jobApplicationProfileLoading;

  return (
    <AuthSentry redirectPath="/profile">
      <Page title="Working profile">
        <Page.Block className="bg-suomifi-blue-bg-light">
          <div className="flex flex-col gap-6">
            <div className="flex flex-row items-center">
              <IconUserBadge className="h-16 w-16" />
              <CustomHeading variant="h2" suomiFiBlue="dark">
                Your working profile
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
            <ProfileDataSentry
              agreement={agreement}
              errorResponses={[
                agreementErrorResponse,
                jobApplicationProfileErrorResponse,
              ]}
            >
              <WorkingProfileForm
                jobApplicationProfile={jobApplicationProfile}
              />
            </ProfileDataSentry>
          )}
        </Page.Block>
      </Page>
    </AuthSentry>
  );
}
