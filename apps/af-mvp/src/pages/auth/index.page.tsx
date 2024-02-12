import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import cookie from 'cookie';
import { IconFailure, IconHome, Text } from 'suomifi-ui-components';
import { LoginState } from '@shared/lib/api/services/auth';
import { SESSION_STORAGE_REDIRECT_KEY } from '@shared/lib/constants';
import { JSONSessionStorage } from '@shared/lib/utils/JSONStorage';
import Page from '@shared/components/layout/page';
import Alert from '@shared/components/ui/alert';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomLink from '@shared/components/ui/custom-link';
import Loading from '@shared/components/ui/loading';

// Transfer the SSR auth token to the client as server side props (instead of HTTP transfer)
export const getServerSideProps: GetServerSideProps<{
  csrfToken: string | null;
}> = async ({ req, res }) => {
  let csrfToken: string | null = null;

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
  const [authError, setAuthError] = useState<
    { title: string; desc: string | undefined } | undefined
  >(undefined);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const { error, error_description } = router.query;
  const userCancelled = error && error === 'cancelled';
  const errorTitle = typeof error === 'string' ? error : undefined;
  const errorDesc =
    typeof error_description === 'string' ? error_description : undefined;

  const routerActions = useCallback(() => {
    setLoading(true);

    if (userCancelled) {
      // Login was cancelled
      window.location.assign('/'); // Redirect to the app root
      return;
    }

    if (csrfToken) {
      LoginState.setCsrfToken(csrfToken); // "Logs in" by storing the CSRF key
      const redirectPath = JSONSessionStorage.pop(SESSION_STORAGE_REDIRECT_KEY); // Redirect to the original path
      window.location.assign(redirectPath || '/'); // Redirect to the original path, with forced reload
      return;
    }

    // Login was a no-show, display auth error
    setLoading(false);
    // set the auth error if can be read from params
    if (errorTitle) {
      setAuthError({
        title: errorTitle,
        desc: errorDesc,
      });
      // clear params
      router.replace({
        pathname: router.pathname,
        query: {},
      });
      // if auth error is not read from params && authError is not set, display generic auth error (clearing params above will cause this effect to re-run)
    } else if (!authError?.title) {
      setAuthError({ title: 'Auth error', desc: 'Something went wrong' });
    }
  }, [
    authError?.title,
    csrfToken,
    errorDesc,
    errorTitle,
    router,
    userCancelled,
  ]);

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
      <main className="container flex flex-col h-full flex-1 md:px-4 justify-center">
        <div className="px-4 md:px-0">
          <CustomHeading variant="h1">
            <span className="text-3xl lg:text-[40px]">
              Access Finland - error
            </span>
          </CustomHeading>
        </div>
        <div className="mt-2 border border-gray-300">
          <Page.Block className="bg-white">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <div className="flex flex-row items-center gap-1">
                  <IconFailure className="h-16 w-16" />
                  <Text className="!font-semibold">Authentication failed</Text>
                </div>
                <Text className="font-semibold">
                  Oops! Looks like something went wrong on our site. Details of
                  the issue can be viewed below.
                </Text>
              </div>
              <Alert status="error" labelText={authError.title}>
                {authError.desc && <Text>{authError.desc}</Text>}
              </Alert>
            </div>
          </Page.Block>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 mt-8">
          <IconHome className="flex-shrink-0 h-14 w-14" />
          <CustomLink href="/" disableVisited $bold>
            Go to Access Finland Home
          </CustomLink>
        </div>
      </main>
    );
  }

  return null;
}
