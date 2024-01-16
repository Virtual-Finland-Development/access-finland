import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { generateCSRFToken } from '@mvp/lib/backend/secrets-and-tokens';
import {
  authStore,
  fetchAuthIdToken,
  signOut,
} from '@mvp/lib/frontend/aws-cognito';
import VFLogo from '@shared/images/virtualfinland_logo_small.png';
import {
  Button,
  IconHome,
  IconLogin,
  IconLogout,
  Text,
} from 'suomifi-ui-components';
import { useToast } from '@shared/context/toast-context';
import CustomImage from '@shared/components/ui/custom-image';
import CustomLink from '@shared/components/ui/custom-link';
import Loading from '@shared/components/ui/loading';
import SignIn from './components/sign-in';

// Create csrf token for the login form (as a ssr prop)
export const getServerSideProps: GetServerSideProps<{
  csrfToken: string | null;
}> = async () => {
  return { props: { csrfToken: await generateCSRFToken() } };
};

export default function SingInPage({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    if (!isAuthenticated) {
      const idToken = await fetchAuthIdToken();
      if (idToken !== null) {
        /// Login to the actual application
        // As we are in the same app context we can login directly without the need for redirect flows etc
        try {
          await authStore.request(
            {
              idToken,
            },
            '/api/auth/system/login'
          );
          setIsAuthenticated(true);
        } catch (error) {
          console.error(error);
          toast({
            title: 'Error',
            content: error?.message || 'Something went wrong.',
            status: 'error',
          });
          await signOut(); // Clear the cognito session as we failed to login to the app
        }
      }
    }
    setIsLoading(false);
  }, [isAuthenticated, setIsLoading, setIsAuthenticated, toast]);

  useEffect(() => {
    if (isLoading) {
      authStore.setCsrfToken(csrfToken);
      checkAuthStatus();
    }
  }, [checkAuthStatus, isLoading, csrfToken]);

  const handleCognitoLogout = async () => {
    setIsLoading(true);
    await signOut();
    setIsAuthenticated(false);
    setIsLoading(false);
    toast({
      title: 'Logged out',
      content: 'Logged out from Virtual Finland.',
      status: 'neutral',
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-[900px] py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 bg-white p-6 border-2 shadow-xl min-h-[600px]">
        <div className="bg-suomifi-blue-bg-dark flex flex-col gap-4 items-center justify-center p-4 md:p-8 rounded">
          <CustomImage src={VFLogo} alt="VF Logo" priority width={300} />
          <Text className="!text-base !text-white !leading-tight">
            Your privacy is important to us. We will only use your email address
            for the purpose of sending the verification code and managing your
            account security.
          </Text>
        </div>
        <div className="col-span-2 flex items-center justify-center relative">
          <div className="max-w-[400px] h-full">
            {!isAuthenticated ? (
              <SignIn />
            ) : (
              <div className="flex flex-col gap-6 h-full justify-center">
                Finish login to the Access Finland
                <Button
                  onClick={() => router.push('/auth')}
                  icon={<IconLogin />}
                >
                  Login to Access Finland
                </Button>
                Logout from your Virtual Finland login session
                <Button
                  variant="secondary"
                  onClick={handleCognitoLogout}
                  icon={<IconLogout />}
                >
                  Log out from Virtual Finland
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-2 mt-8">
        <IconHome className="flex-shrink-0 h-14 w-14" />
        <CustomLink href="/" disableVisited $bold>
          Go to Access Finland Home
        </CustomLink>
      </div>
    </div>
  );
}
