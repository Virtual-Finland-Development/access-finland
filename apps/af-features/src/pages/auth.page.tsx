import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Text } from 'suomifi-ui-components';
import { AuthProvider } from '@shared/types';
import api from '@shared/lib/api';
import { SESSION_STORAGE_REDIRECT_KEY } from '@shared/lib/constants';
import { generateAppContextHash } from '@shared/lib/utils';
import { JSONSessionStorage } from '@shared/lib/utils/JSONStorage';
import { useAuth } from '@shared/context/auth-context';
import Alert from '@shared/components/ui/alert';
import CustomLink from '@shared/components/ui/custom-link';
import Loading from '@shared/components/ui/loading';

export default function AuthPage() {
  const { logIn, logOut } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const { provider, loginCode, event, success, message } = router.query;

  const handleAuth = useCallback(async () => {
    try {
      const loggedInState = await api.auth.logIn({
        loginCode: loginCode as string,
        appContext: generateAppContextHash(),
      });

      logIn(loggedInState);
      const redirectPath = JSONSessionStorage.pop(SESSION_STORAGE_REDIRECT_KEY);
      router.push(redirectPath || '/');
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      setAuthError(error ? (error as string) : 'Logging out failed.');
    }
  }, [logIn, loginCode, router]);

  const routerActions = useCallback(() => {
    // False positives
    if (!provider || !(event === 'login' || event === 'logout')) {
      router.push('/');
      return;
    }

    setLoading(true);

    // Failures
    if (success !== 'true') {
      setLoading(false);
      setAuthError(message ? (message as string) : `${event} failed.`);
      return;
    }

    // Successes
    if (event === 'login') {
      if (provider === AuthProvider.TESTBED) {
        handleAuth();
      } else {
        router.push('/');
      }
    } else {
      logOut();
      router.push('/');
    }
  }, [provider, event, success, message, handleAuth, router, logOut]);

  useEffect(() => {
    if (router.isReady) {
      routerActions();
    }
  }, [router.isReady, router.query, routerActions]);

  if (isLoading) {
    return <Loading />;
  }

  if (authError) {
    return (
      <div className="container flex justify-center p-4">
        <div className="w-[600px]">
          <Alert status="error" labelText="Error">
            <div className="flex flex-col gap-3">
              <Text>{authError}</Text>
              <CustomLink href="/">Go to home page</CustomLink>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  return null;
}
