import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Text } from 'suomifi-ui-components';
import { LoginState } from 'vf-shared/src/lib/api/services/auth';
import { SESSION_STORAGE_REDIRECT_KEY } from 'vf-shared/src/lib/constants';
import { JSONSessionStorage } from 'vf-shared/src/lib/utils/JSONStorage';
import Alert from '@shared/components/ui/alert';
import CustomLink from '@shared/components/ui/custom-link';
import Loading from '@shared/components/ui/loading';

// Transfer the SSR auth token to the client as server side props (instead of HTTP query param transfer)
export const getServerSideProps: GetServerSideProps<{
  authFlowToken: string;
}> = async ({ req, res }) => {
  let authFlowToken = null;

  if (req.cookies.authFlowToken) {
    // Pop the auth token from the cookie
    authFlowToken = req.cookies.authFlowToken;
    res.setHeader('Set-Cookie', `authFlowToken=; Path=/; HttpOnly`);
  }

  return { props: { authFlowToken: authFlowToken } };
};

export default function AuthPage({ authFlowToken }) {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const routerActions = useCallback(async () => {
    setLoading(true);

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
  }, [authFlowToken]);

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
