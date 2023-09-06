import { Fragment } from 'react';
import { IconUserBadge } from 'suomifi-ui-components';
import { Text } from 'suomifi-ui-components';
import { useJobApplicantProfile } from '@shared/lib/hooks/profile';
import { useAuth } from '@shared/context/auth-context';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import ProfileErrors from '@shared/components/pages/profile/profile-errors';
import WorkingProfileForm from '@shared/components/pages/profile/working-profile-form';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';

export default function WorkingProfilePage() {
  const { isAuthenticated } = useAuth();
  const {
    data: jobApplicationProfile,
    isLoading,
    errorResponse,
  } = useJobApplicantProfile(isAuthenticated);

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
            <Fragment>
              {errorResponse?.shouldPrintError ? (
                <ProfileErrors errorMessages={[errorResponse.message]} />
              ) : (
                <WorkingProfileForm
                  jobApplicationProfile={jobApplicationProfile}
                />
              )}
            </Fragment>
          )}
        </Page.Block>
      </Page>
    </AuthSentry>
  );
}
