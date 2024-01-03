import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { fetchAuthIdToken, signOut } from '@mvp/lib/frontend/aws-cognito';
import VFLogo from '@shared/images/virtualfinland_logo_small.png';
import {
  Button,
  IconHome,
  IconLogin,
  IconLogout,
  Text,
} from 'suomifi-ui-components';
import apiClient from '@shared/lib/api/api-client';
import CustomImage from '@shared/components/ui/custom-image';
import CustomLink from '@shared/components/ui/custom-link';
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

  return (
    <div className="max-w-[900px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 bg-white p-6 border-2 shadow-xl min-h-[600px]">
        <div className="bg-suomifi-blue-bg-dark flex flex-col gap-4 items-center justify-center p-2 md:p-8 rounded">
          <CustomImage
            src={VFLogo}
            alt="VF Logo"
            priority
            width={300}
            height={150}
          />
          <Text className="!text-base !text-white !leading-tight">
            Your privacy is important to us. We will only use your email address
            for the purpose of sending the verification code and managing your
            account security.
          </Text>
        </div>
        <div className="col-span-2 flex items-center justify-center relative">
          <div className="max-w-[400px] h-full">
            {!isAuthenticated ? (
              <SignInForm />
            ) : (
              <div className="flex flex-col gap-6 h-full justify-center">
                Finish login to the Access Finland
                <Button
                  onClick={() => router.push('/auth')}
                  icon={<IconLogin />}
                >
                  Login to Access Finland
                </Button>
                Logout from your cognito session
                <Button
                  variant="secondary"
                  onClick={handleCodeLogout}
                  icon={<IconLogout />}
                >
                  Log out from Cognito
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-2 mt-12">
        <IconHome className="flex-shrink-0 h-14 w-14" />
        <CustomLink href="/" disableVisited $bold>
          Go to Access Finland Home
        </CustomLink>
      </div>
    </div>
  );
}
