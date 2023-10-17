import { Fragment } from 'react';
import { IconUserProfile } from 'suomifi-ui-components';
import { Text } from 'suomifi-ui-components';
import { usePersonBasicInfo } from '@shared/lib/hooks/profile';
import { useAuth } from '@shared/context/auth-context';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import PersonalProfileForm from '@shared/components/pages/profile/personal-profile-form';
import ProfileErrors from '@shared/components/pages/profile/profile-errors';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';

export default function PersonalProfilePage() {
  const { isAuthenticated } = useAuth();
  const {
    data: personBasicInformation,
    isLoading,
    errorResponse,
  } = usePersonBasicInfo(isAuthenticated);

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
            <Fragment>
              {errorResponse?.shouldPrintError ? (
                <ProfileErrors errorMessages={[errorResponse.message]} />
              ) : (
                <PersonalProfileForm
                  personBasicInformation={personBasicInformation}
                />
              )}
            </Fragment>
          )}
        </Page.Block>
      </Page>
    </AuthSentry>
  );
}
