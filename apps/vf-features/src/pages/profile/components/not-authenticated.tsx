import { useState } from 'react';
import { Button, Checkbox, Text } from 'suomifi-ui-components';
import api from '@shared/lib/api';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomLink from '@shared/components/ui/custom-link';

export default function ProfileNotAuthenticated() {
  const [isLoading, setLoading] = useState(false);

  const loginHandler = () => {
    setLoading(true);
    api.auth.directToAuthGwLogin('/profile');
  };

  return (
    <Page.Block className="bg-white">
      <CustomHeading variant="h2" suomiFiBlue="dark">
        Create your profile
      </CustomHeading>
      <div className="flex flex-col mt-8 gap-6 p-4 bg-suomifi-blue-bg-light">
        <CustomHeading variant="h4">About your personal account</CustomHeading>
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
          {isLoading ? 'Redirecting...' : 'Sign in with testbed'}
        </Button>
      </div>
    </Page.Block>
  );
}
