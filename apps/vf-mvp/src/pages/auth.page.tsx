import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Text } from 'suomifi-ui-components';
import { LoginState } from 'vf-shared/src/lib/api/services/auth';
import { SESSION_STORAGE_REDIRECT_KEY } from 'vf-shared/src/lib/constants';
import { JSONSessionStorage } from 'vf-shared/src/lib/utils/JSONStorage';
import Alert from '@shared/components/ui/alert';
import CustomLink from '@shared/components/ui/custom-link';
import Loading from '@shared/components/ui/loading';

export default function AuthPage() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const routerActions = useCallback(async () => {
    setLoading(true);

    const authFlowToken = await LoginState.pullAuthFlowToken();

    // Login with the SSR auth token
    if (authFlowToken) {
      setLoading(false);
      LoginState.setAuthFlowToken(authFlowToken); // "Logs in" by storing the authToken as the CSRF key
      const redirectPath = JSONSessionStorage.pop(SESSION_STORAGE_REDIRECT_KEY); // Redirect to the original path
      window.location.assign(redirectPath || '/'); // Redirect to the original path, with forced reload
      return;
    }

    // Failures
    setLoading(false);
    setAuthError('Authentication failed.');
  }, []);

  useEffect(() => {
    if (router.isReady) {
      routerActions();
    }
  }, [router.isReady, routerActions]);

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
