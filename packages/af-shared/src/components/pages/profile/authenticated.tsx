import { Text } from 'suomifi-ui-components';
import {
  useJobApplicantProfile,
  usePersonBasicInfo,
} from '@/lib/hooks/profile';
import Page from '@/components/layout/page';
import CustomHeading from '@/components/ui/custom-heading';
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
