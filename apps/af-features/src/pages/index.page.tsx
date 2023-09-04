import { useRouter } from 'next/router';
import womanLaptopImage from '@shared/images/woman-laptop.jpg';
import {
  Button,
  IconBook,
  IconCatalog,
  IconDoctor,
  IconFamily,
  IconManButtons,
  IconManLaptop,
  IconOrganisation,
  IconShop,
  IconTeam,
  IconUserProfile,
  Text,
} from 'suomifi-ui-components';
import { useAuth } from '@shared/context/auth-context';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomImage from '@shared/components/ui/custom-image';
import CustomLink from '@shared/components/ui/custom-link';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <Page title="Home" showHeading={false}>
      <Page.Block className="bg-suomifi-blue-bg-light">
        <CustomHeading variant="h2" suomiFiBlue="dark">
          The only service you need for moving into Finland
        </CustomHeading>
        <div className="flex flex-col mt-8">
          <IconBook
            baseColor="grey"
            highlightColor="purple"
            className="h-16 w-16"
          />
          <Text>
            All information and services about moving to Finland and living in
            Finland can be found under one address. From here, you can apply to
            all Finnish government agencies from one place. Whether you are
            starting your process of moving to Finland or you have already
            entered country you’ll find guidance and tools to communicate with
            right authorities.
          </Text>
        </div>
        <div className="flex flex-col mt-8">
          <IconUserProfile
            baseColor="grey"
            highlightColor="purple"
            className="h-16 w-16"
          />
          <Text>
            For the beginning all you need is to create your own profile and
            start the application process. After having profile you have full
            access to your personal data at anytime and from anywhere.
          </Text>
        </div>
      </Page.Block>

      <Page.Block className="bg-suomifi-blue-bg-light">
        <CustomHeading variant="h2" suomiFiBlue="dark">
          {isAuthenticated
            ? 'Manage your profile'
            : 'Start by creating your profile'}
        </CustomHeading>
        <div className="py-4">
          <Button onClick={() => router.push('/profile')}>
            {isAuthenticated ? 'Go to profile' : 'Create profile'}
          </Button>
        </div>
      </Page.Block>

      <Page.Block className="bg-white">
        <div className="max-w-sm mb-6">
          <CustomImage
            src={womanLaptopImage}
            alt="Woman with laptop"
            width={330}
            height={165}
            priority
          />
        </div>

        <CustomHeading variant="h2" suomiFiBlue="dark">
          What can I do here?
        </CustomHeading>
        <div className="flex flex-col mt-4">
          <Text>
            Choose who you’re presenting and click for more information about
            what can you do.
          </Text>
          <div className="flex flex-col gap-6 mt-6">
            <div className="flex flex-row items-center gap-6 py-2">
              <IconManButtons className="h-16 w-16 flex-shrink-0" />
              <CustomLink href="#">Apply for yourself</CustomLink>
            </div>
            <div className="flex flex-row items-center gap-6 py-2">
              <IconTeam className="h-16 w-16 flex-shrink-0" />
              <CustomLink href="#">Apply on behalf of someone</CustomLink>
            </div>
            <div className="flex flex-row items-center gap-6 py-2">
              <IconOrganisation className="h-16 w-16 flex-shrink-0" />
              <CustomLink href="#">
                Apply on behalf of company or organization
              </CustomLink>
            </div>
          </div>
        </div>
      </Page.Block>

      <Page.Block className="bg-white">
        <CustomHeading variant="h2" suomiFiBlue="dark">
          I’m coming to Finland to
        </CustomHeading>
        <div className="flex flex-col mt-4">
          <div className="bg-suomifi-blue-bg-light flex flex-row items-center gap-6 py-2">
            <IconDoctor className="h-16 w-16 flex-shrink-0" />
            <CustomLink href="#" $bold>
              work
            </CustomLink>
          </div>
          <div className="flex flex-row items-center gap-6 py-2">
            <IconManLaptop className="h-16 w-16 flex-shrink-0" />
            <CustomLink href="#" $bold>
              study
            </CustomLink>
          </div>
          <div className="bg-suomifi-blue-bg-light flex flex-row items-center gap-6 py-2">
            <IconShop className="h-16 w-16 flex-shrink-0" />
            <CustomLink href="/company" $bold>
              create business
            </CustomLink>
          </div>
          <div className="flex flex-row items-center gap-6 py-2">
            <IconFamily className="h-16 w-16 flex-shrink-0" />
            <CustomLink href="#" $bold>
              along with family
            </CustomLink>
          </div>
          <div className="bg-suomifi-blue-bg-light flex flex-row items-center gap-6 py-2">
            <IconCatalog className="h-16 w-16 flex-shrink-0" />
            <CustomLink href="#" $bold>
              other
            </CustomLink>
          </div>
        </div>
      </Page.Block>
    </Page>
  );
}
