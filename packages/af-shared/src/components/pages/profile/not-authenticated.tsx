import { Fragment, useState } from 'react';
import SinunaLogo from '@shared/images/sinuna-logo.svg';
import { Button, Checkbox, Text } from 'suomifi-ui-components';
import api from '@/lib/api';
import { isExportedApplication } from '@/lib/utils';
import Page from '@/components/layout/page';
import CustomHeading from '@/components/ui/custom-heading';
import CustomImage from '@/components/ui/custom-image';
import CustomLink from '@/components/ui/custom-link';

const isExport = isExportedApplication();

export default function ProfileNotAuthenticated() {
  const [isLoading, setLoading] = useState(false);

  const loginHandler = () => {
    setLoading(true);
    api.auth.directToAuthLogin('/profile');
  };

  // Resolve the auth method text
  const authMethod = isExport ? 'Testbed' : 'Sinuna';
  const infoTextPost = isExport
    ? `Granting permission for this account will help you
  to provide information only once and use it afterwords whenever
  needed.`
    : `Log in with Sinuna login service to create and manage Your personal
  profile and job applicant profile.`;

  return (
    <Page.Block className="bg-white">
      <CustomHeading variant="h2" suomiFiBlue="dark">
        Sign in to Your profile
      </CustomHeading>
      <div className="flex flex-col mt-8 gap-6 p-4 bg-suomifi-blue-bg-light">
        <CustomHeading variant="h3" className="!text-lg">
          About your personal profile account
        </CustomHeading>
        <Text>
          Sign in to Your digital profile. Any data we will ask is not for us -
          it is for you. {infoTextPost}
        </Text>
        {!isExport ? (
          <CustomImage
            src={SinunaLogo}
            alt="Sinuna logo"
            width={250}
            priority
          />
        ) : (
          <Fragment>
            <CustomLink href="/profile">How is my data used?</CustomLink>
            <Checkbox variant="large">Grant permissions</Checkbox>
          </Fragment>
        )}
      </div>
      <div className="flex flex-col items-start gap-4 mt-6">
        <Text>Let’s sign in to Access Finland</Text>
        <Button onClick={loginHandler} disabled={isLoading} className="!w-auto">
          {isLoading ? 'Redirecting...' : `Sign in with ${authMethod}`}
        </Button>
      </div>
    </Page.Block>
  );
}
