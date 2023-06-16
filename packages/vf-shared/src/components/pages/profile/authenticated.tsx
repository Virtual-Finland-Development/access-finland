import { Button, InlineAlert, Text } from 'suomifi-ui-components';
import {
  useJobApplicantProfile,
  usePersonBasicInfo,
} from '@/lib/hooks/profile';
import Page from '@/components/layout/page';
import CustomHeading from '@/components/ui/custom-heading';
import DangerButton from '@/components/ui/danger-button';
import Loading from '@/components/ui/loading';
import ProfileDetails from './profile-details/profile-details';

export default function ProfileAuthenticated() {
  const { data: personBasicInformation, isLoading: basicInformationLoading } =
    usePersonBasicInfo();
  const {
    data: jobApplicationProfile,
    isLoading: jobApplicationProfileLoading,
  } = useJobApplicantProfile();

  const isLoading = basicInformationLoading || jobApplicationProfileLoading;

  return (
    <>
      {isLoading ? (
        <Page.Block className="bg-white flex items-center justify-center min-h-[200px]">
          <Loading />
        </Page.Block>
      ) : (
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
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid
              ex ea commodi consequat. Quis aute iure reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              obcaecat cupiditat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </Text>

            <InlineAlert status="warning">
              <div className="flex flex-col items-start gap-6">
                <Text>
                  New Terms of Usage has been released for this service,{' '}
                  <a
                    href="/profile/terms-of-usage"
                    rel="noopener noreferrer"
                    target="blank"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    please read them carefully here.
                  </a>
                </Text>

                <Text>
                  To continue to use this service, we need your approval for the
                  updated terms.
                </Text>

                <div className="flex flex-row gap-4">
                  <Button>I accept the updated Terms</Button>
                  <DangerButton onClick={() => {}}>
                    I don&apos;t accept, delete my profile
                  </DangerButton>
                </div>
              </div>
            </InlineAlert>

            <ProfileDetails
              personBasicInformation={personBasicInformation}
              jobApplicationProfile={jobApplicationProfile}
            />
          </div>
        </Page.Block>
      )}
    </>
  );
}
