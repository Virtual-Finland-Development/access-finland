import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import cookie from 'cookie';
import { Text } from 'suomifi-ui-components';
import { LoginState } from '@shared/lib/api/services/auth';
import { SESSION_STORAGE_REDIRECT_KEY } from '@shared/lib/constants';
import { JSONSessionStorage } from '@shared/lib/utils/JSONStorage';
import Alert from '@shared/components/ui/alert';
import CustomLink from '@shared/components/ui/custom-link';
import Loading from '@shared/components/ui/loading';

// Transfer the SSR auth token to the client as server side props (instead of HTTP transfer)
export const getServerSideProps: GetServerSideProps<{
  csrfToken: string | null;
}> = async ({ req, res }) => {
  let csrfToken = null;

  if (req.cookies.csrfToken) {
    // Pop (retrieve and clear) the auth token from the cookie
    csrfToken = req.cookies.csrfToken;
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('csrfToken', '', {
        path: '/',
        expires: new Date(),
      })
    );
  }

  return { props: { csrfToken: csrfToken } };
};

export default function AuthPage({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element | null {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const routerActions = useCallback(async () => {
    setLoading(true);

    if (csrfToken) {
      LoginState.setCsrfToken(csrfToken); // "Logs in" by storing the CSRF key
      const redirectPath = JSONSessionStorage.pop(SESSION_STORAGE_REDIRECT_KEY); // Redirect to the original path
      window.location.assign(redirectPath || '/'); // Redirect to the original path, with forced reload
      return;
    }

    // Login was a no-show
    setLoading(false);
    setAuthError('Authentication failed.');
  }, [csrfToken]);

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
