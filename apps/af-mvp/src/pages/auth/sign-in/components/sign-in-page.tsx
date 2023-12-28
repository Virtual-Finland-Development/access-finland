import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Text } from 'suomifi-ui-components';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import SignInForm from './sign-in-form';

export default function SingInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState('loading');

  if (authStatus === 'authenticated') {
    return (
      <div className="flex flex-col items-center justify-center mt-8 gap-6">
        Kill your cognito session
        <Button onClick={() => alert('nope')}>Kill it</Button>
      </div>
    );
  }

  return (
    <Page title="Sign In">
      <Page.Block className="bg-white">
        <div className="flex flex-col mt-8 gap-6">
          <div className="bg-suomifi-blue-bg-light p-4 flex flex-col gap-6">
            <CustomHeading variant="h3" className="!text-lg">
              Sing in with email
            </CustomHeading>
            <Text>
              We utilize a one-time code verification process. Please enter your
              email address below to receive a unique code that you can use to
              sign in securely.
            </Text>
            <Text>
              Once you’ve entered your email address, a one-time code will be
              sent to your inbox. Use that code to complete the sign-in process.
              Your privacy is important to us. We will only use your email
              address for the purpose of sending the verification code and
              managing your account security.
            </Text>
          </div>

          <SignInForm />
        </div>
      </Page.Block>
    </Page>
  );
}
