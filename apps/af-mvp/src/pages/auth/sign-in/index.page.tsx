import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { fetchAuthIdToken, signOut } from '@mvp/lib/frontend/aws-cognito';
import { Button, Text } from 'suomifi-ui-components';
import apiClient from '@shared/lib/api/api-client';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';
import SignInForm from './components/sign-in-form';

export default function SingInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    if (!isAuthenticated) {
      const idToken = await fetchAuthIdToken();
      if (idToken !== null) {
        /// Login to the actual application
        // As we are in the same app context we can login directly without the need for redirect flows etc
        try {
          await apiClient.post('/api/auth/system/login', { idToken });
          setIsAuthenticated(true);
        } catch (error) {
          console.error(error);
          await signOut();
        }
      }
    }
    setIsLoading(false);
  }, [isAuthenticated, setIsLoading, setIsAuthenticated]);

  useEffect(() => {
    if (isLoading) {
      checkAuthStatus();
    }
  }, [checkAuthStatus, isLoading]);

  const handleCodeLogout = async () => {
    await signOut();
    router.reload();
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center mt-8 gap-6">
        Finish login to the Access Finland
        <Button onClick={() => router.push('/auth')}>
          Login to the Access Finland
        </Button>
        Logout from your cognito session
        <Button variant="secondary" onClick={handleCodeLogout}>
          Log out from Cognito
        </Button>
      </div>
    );
  }

  return (
    <Page title="Sign In">
      <Page.Block className="bg-white">
        <div className="flex flex-col mt-8 gap-6">
          <div className="bg-suomifi-blue-bg-light p-4 flex flex-col gap-6">
            <CustomHeading variant="h3" className="!text-lg">
              Sign in with email
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
