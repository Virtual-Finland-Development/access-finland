'use client';

import { StaticIcon } from 'suomifi-ui-components';
import { Text } from 'suomifi-ui-components';
import AuthSentry from '@/components/auth-sentry';
import Page from '@/components/layout/page';
import CustomHeading from '@/components/ui/custom-heading';
import { useJobApplicantProfile } from '@shared/lib/hooks/profile';
import Loading from '@shared/components/ui/loading';
import WorkingProfileForm from '../components/working-profile-form';

export default function WorkingProfilePage() {
  const { data: jobApplicationProfile, isLoading } = useJobApplicantProfile();

  return (
    <AuthSentry redirectPath="/profile">
      <Page title="Working profile">
        {isLoading ? (
          <Page.Block className="bg-white flex items-center justify-center min-h-[200px]">
            <Loading />
          </Page.Block>
        ) : (
          <>
            <Page.Block className="bg-suomifi-blue-bg-light">
              <div className="flex flex-col gap-6">
                <div className="flex flex-row items-center">
                  <StaticIcon icon="userBadge" className="h-16 w-16" />
                  <CustomHeading variant="h2" suomiFiBlue="dark">
                    Your working profile
                  </CustomHeading>
                </div>
                <Text>
                  Please choose the best described options of yourself. This
                  information is under your control all the time and you will
                  decide to whom you want to share it.
                </Text>
              </div>
            </Page.Block>
            <Page.Block className="bg-white">
              <WorkingProfileForm
                jobApplicationProfile={jobApplicationProfile}
              />
            </Page.Block>
          </>
        )}
      </Page>
    </AuthSentry>
  );
}
