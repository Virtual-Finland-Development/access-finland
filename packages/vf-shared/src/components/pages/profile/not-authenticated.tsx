import { useState } from 'react';
import { Button, Checkbox, Text } from 'suomifi-ui-components';
import api from '@/lib/api';
import { isExportedApplication } from '@/lib/utils';
import Page from '@/components/layout/page';
import CustomHeading from '@/components/ui/custom-heading';
import CustomLink from '@/components/ui/custom-link';

export default function ProfileNotAuthenticated() {
  const [isLoading, setLoading] = useState(false);

  const loginHandler = () => {
    setLoading(true);
    api.auth.directToAuthGwLogin('/profile');
  };

  // Resolve the auth method text
  const authMethod = isExportedApplication() ? 'Testbed' : 'Sinuna';

  return (
    <Page.Block className="bg-white">
      <CustomHeading variant="h2" suomiFiBlue="dark">
        Create your profile
      </CustomHeading>
      <div className="flex flex-col mt-8 gap-6 p-4 bg-suomifi-blue-bg-light">
        <CustomHeading variant="h3" className="!text-lg">
          About your personal account
        </CustomHeading>
        <Text>
          We will create your digital profile. Any data we will ask is not for
          us - it is for you. Granting permission for this account will help you
          to provide information only once and use it afterwords whenever
          needed.
        </Text>
        <CustomLink href="/profile">How is my data used?</CustomLink>
        <Checkbox variant="large">Grant permissions</Checkbox>
      </div>
      <div className="flex flex-col items-start gap-4 mt-6">
        <Text>Let’s sign in to Virtual Finland</Text>
        <Button onClick={loginHandler} disabled={isLoading} className="!w-auto">
          {isLoading ? 'Redirecting...' : `Sign in with ${authMethod}`}
        </Button>
      </div>
    </Page.Block>
  );
}
