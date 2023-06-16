import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Link, Text } from 'suomifi-ui-components';
import Page from 'vf-shared/src/components/layout/page';
import Loading from 'vf-shared/src/components/ui/loading';
import Alert from '@shared/components/ui/alert';
import CustomLink from '@shared/components/ui/custom-link';

function getSinunaServiceUrl() {
  if (process.env.NODE_ENV !== 'production') {
    return 'https://frontend.sunbackend.qa.sinuna.fi';
  }
  return 'https://itsepalvelu.tunnus.sinuna.fi';
}

export default function LoggedOutPage() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const sinunaLoginServiceLink = getSinunaServiceUrl();
  const { initiator } = router.query;
  useEffect(() => {
    setLoading(true);
    if (router.isReady) {
      if (initiator === 'auth-service') {
        window.history.replaceState(null, '', '/logged-out'); // Clear query params without redrawing
      } else {
        router.push('/'); // Redirect to home page not flagged as coming from auth service
        return;
      }
      setLoading(false);
    }
  }, [router.isReady, router, setLoading, initiator]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Page title="Logged out">
      <div className="min-w-xl max-w-xl">
        <Alert status="neutral" labelText="Logged out from Virtual Finland!">
          <div className="flex flex-col gap-3">
            <Text>
              Logging out from Virtual Finland succeeded. Note that the Sinuna
              login session might still be active.
            </Text>
            <CustomLink href="/">Go to home page</CustomLink>
            <Text>Manage Sinuna login at:</Text>
            <Link
              target="_blank"
              rel="noreferrer noopener"
              href={sinunaLoginServiceLink}
            >
              Sinuna Service
            </Link>
          </div>
        </Alert>
      </div>
    </Page>
  );
}
