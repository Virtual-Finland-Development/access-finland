import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { generateCSRFToken } from '@mvp/lib/backend/secrets-and-tokens';
import {
  authStore,
  deleteUser,
  fetchAuthIdToken,
  parseCognitoError,
  signOut,
} from '@mvp/lib/frontend/aws-cognito';
import VFLogo from '@shared/images/virtualfinland_logo_small.png';
import { IconHome, Text } from 'suomifi-ui-components';
import { useToast } from '@shared/context/toast-context';
import CustomImage from '@shared/components/ui/custom-image';
import CustomLink from '@shared/components/ui/custom-link';
import Loading from '@shared/components/ui/loading';
import SignIn from './components/sign-in';
import SignedIn from './components/signed-in';

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
      const isLoggedInCognito = (await fetchAuthIdToken()) !== null;
      setIsAuthenticated(isLoggedInCognito);
    }
    setIsLoading(false);
  }, [isAuthenticated, setIsLoading, setIsAuthenticated]);

  useEffect(() => {
    if (isLoading) {
      authStore.setCsrfToken(csrfToken); // Initialize cognito auth store before everything else
      checkAuthStatus();
    }
  }, [checkAuthStatus, isLoading, csrfToken]);

  const handleError = (error: Error) => {
    console.error(error);
    const cognitoError = parseCognitoError(error);
    toast({
      title: cognitoError.type,
      content: cognitoError.message || 'Something went wrong.',
      status: 'error',
    });
  };

  const handleCognitoLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setIsAuthenticated(false);
      setIsLoading(false);
      toast({
        title: 'Logged out',
        content: 'Logged out from Virtual Finland.',
        status: 'neutral',
      });
    } catch (error) {
      handleError(error);
    }
    setIsLoading(false);
  };

  const handleCongnitoIdDelete = async () => {
    setIsLoading(true);
    try {
      await deleteUser();
      setIsAuthenticated(false);
      toast({
        title: 'Identity deleted',
        content: 'The Virtual Finland identity deleted.',
        status: 'neutral',
      });
    } catch (error) {
      handleError(error);
    }
    setIsLoading(false);
  };

  const handleAccessFinlandLogin = async () => {
    setIsLoading(true);

    // Login to the actual application
    // As we are in the same app context we can login directly without the need for redirect flows etc
    try {
      const idToken = await fetchAuthIdToken();
      if (idToken === null) {
        throw new Error('Not logged in to Virtual Finland.');
      }

      // Prepare login flow
      await authStore.request(
        {
          idToken,
        },
        '/api/auth/system/prepare-login'
      );

      // Redirect to the actual app
      router.push('/auth');
    } catch (error) {
      handleError(error);
      await signOut(); // Clear the cognito session as we failed to login to the app
      setIsLoading(false);
    }
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
              <SignedIn
                handleLogin={handleAccessFinlandLogin}
                handleLogout={handleCognitoLogout}
                handleDelete={handleCongnitoIdDelete}
              />
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
