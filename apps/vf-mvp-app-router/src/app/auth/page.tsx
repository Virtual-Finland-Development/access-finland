'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Text } from 'suomifi-ui-components';
import { AuthProvider } from '@/types';
import api from '@/lib/api';
import { LOCAL_STORAGE_REDIRECT_KEY } from '@/lib/constants';
import { generateAppContextHash } from '@/lib/utils';
import { JSONLocalStorage } from '@/lib/utils/JSONStorage';
import { useAuth } from '@/context/auth-context';
import Alert from '@/components/ui/alert';
import CustomLink from '@/components/ui/custom-link';
import Loading from '@/components/ui/loading';

export default function AuthPage() {
  const { logIn, logOut } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider');
  const loginCode = searchParams.get('loginCode');
  const event = searchParams.get('event');
  const success = searchParams.get('success');
  const message = searchParams.get('message');

  const handleAuth = useCallback(async () => {
    try {
      const loggedInState = await api.auth.logIn({
        loginCode: loginCode as string,
        appContext: generateAppContextHash(),
      });

      logIn(loggedInState);
      const redirectPath = JSONLocalStorage.get(LOCAL_STORAGE_REDIRECT_KEY);
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
    if (router) {
      routerActions();
    }
  }, [router, routerActions]);

  if (isLoading) {
    return <Loading />;
  }

  if (authError) {
    return (
      <div className="min-w-xl max-w-xl">
        <Alert status="error" labelText="Error">
          <div className="flex flex-col gap-3">
            <Text>{authError}</Text>
            <CustomLink href="/">Go to home page</CustomLink>
          </div>
        </Alert>
      </div>
    );
  }

  return null;
}
