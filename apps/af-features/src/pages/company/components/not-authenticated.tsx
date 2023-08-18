import { useRouter } from 'next/router';
import { useState } from 'react';
import manLaptopImage from '@shared/images/man-laptop.jpg';
import { Button, IconBuildings, IconLogin, Text } from 'suomifi-ui-components';
import api from '@shared/lib/api';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomImage from '@shared/components/ui/custom-image';
import CustomText from '@shared/components/ui/custom-text';

export default function CompanyNotAuthenticated() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const loginHandler = () => {
    setLoading(true);
    api.auth.directToAuthLogin('/company');
  };

  return (
    <>
      <Page.Block className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-1 lg:-mx-12">
          <div className="bg-suomifi-light text-white flex flex-col gap-8 items-center justify-center px-4 py-8">
            <div className="hidden md:block">
              <IconBuildings className="h-16 w-16 flex-shrink-0 bg-white rounded-full" />
            </div>
            <CustomHeading variant="h2" $center>
              Establish a company or modify company information
            </CustomHeading>
            <CustomText $center>
              Identify yourself into Company. You can then establish a company
              or modify existing company information.
            </CustomText>
            <Button
              icon={<IconLogin />}
              variant="inverted"
              onClick={loginHandler}
              disabled={isLoading}
            >
              {isLoading ? 'Redirecting...' : 'Identification'}
            </Button>
          </div>
          <div className="hidden md:block relative">
            <CustomImage
              src={manLaptopImage}
              alt="Man with laptop"
              className="object-cover h-full w-full"
              width={537}
              height={395}
              priority
            />
          </div>
        </div>
        <div className="flex flex-col mt-8 gap-6">
          <CustomHeading variant="h2" suomiFiBlue="dark">
            Company page header
          </CustomHeading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
            ea commodi consequat. Quis aute iure reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
        </div>
        <div className="flex flex-col mt-8 gap-6 items-start">
          <CustomHeading variant="h2" suomiFiBlue="dark">
            Search companies
          </CustomHeading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
            ea commodi consequat. Quis aute iure reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
          <Button onClick={() => router.push('/company/search')}>
            Search companies
          </Button>
        </div>
      </Page.Block>
    </>
  );
}
