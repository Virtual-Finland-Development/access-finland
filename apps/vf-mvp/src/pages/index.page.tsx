import { useRouter } from 'next/router';
import { Button, IconBook, IconUserProfile, Text } from 'suomifi-ui-components';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';

export default function HomePage() {
  const router = useRouter();

  return (
    <Page title="Home" showHeading={false}>
      <Page.Block className="bg-suomifi-blue-bg-light">
        <CustomHeading variant="h2" suomiFiBlue="dark">
          First point of contact with Finland
        </CustomHeading>
        <div className="flex flex-col mt-8">
          <IconBook
            baseColor="grey"
            highlightColor="purple"
            className="h-16 w-16"
          />
          <Text>
            Start your journey by creating your Finnish profile below. We have
            also included useful links to help you find all the information you
            need about building a life in Finland.
          </Text>
        </div>
        <div className="flex flex-col mt-8">
          <IconUserProfile
            baseColor="grey"
            highlightColor="purple"
            className="h-16 w-16"
          />
          <Text>
            In the first phase of the service, your Finnish profile will help
            you find suitable jobs in Finland. You will always be in full
            control of your own data and can always update or remove your
            (Access Finland) profile.
          </Text>
        </div>
      </Page.Block>

      <Page.Block className="bg-suomifi-blue-bg-light">
        <CustomHeading variant="h2" suomiFiBlue="dark">
          Start by creating your profile
        </CustomHeading>
        <div className="py-4">
          <Button onClick={() => router.push('/profile')}>
            Create profile
          </Button>
        </div>
      </Page.Block>
    </Page>
  );
}
