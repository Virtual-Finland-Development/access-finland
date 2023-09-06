import { IconUserBadge } from 'suomifi-ui-components';
import { Text } from 'suomifi-ui-components';
import {
  useJobApplicantProfile,
  useProfileTosAgreement,
} from '@shared/lib/hooks/profile';
import { isExportedApplication } from '@shared/lib/utils';
import { useAuth } from '@shared/context/auth-context';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import ProfileDataSentry from '@shared/components/pages/profile/profile-data-sentry';
import WorkingProfileForm from '@shared/components/pages/profile/working-profile-form';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';

const isExport = isExportedApplication();

export default function WorkingProfilePage() {
  const { isAuthenticated } = useAuth();
  const {
    data: agreement,
    isLoading: agreementLoading,
    errorResponse: agreementErrorResponse,
  } = useProfileTosAgreement(isAuthenticated && !isExport); // enable TOS functionality for MVP only

  // for MVP: enabled if user has accepted the agreement, OK for Features if user is authenticated
  const shouldFetchProfileData =
    !!agreement?.accepted || (isExport && isAuthenticated);

  const {
    data: jobApplicationProfile,
    isLoading: jobApplicationProfileLoading,
    errorResponse: jobApplicationProfileErrorResponse,
  } = useJobApplicantProfile(shouldFetchProfileData);

  const isLoading = agreementLoading || jobApplicationProfileLoading;

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
