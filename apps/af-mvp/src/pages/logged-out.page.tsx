import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SinunaLogo from '@shared/images/sinuna-logo.svg';
import CustomHeading from 'af-shared/src/components/ui/custom-heading';
import { Button, Text } from 'suomifi-ui-components';
import { AuthProvider } from '@shared/types';
import { getRuntimeStage } from '@shared/lib/utils';
import Page from '@shared/components/layout/page';
import Alert from '@shared/components/ui/alert';
import CustomImage from '@shared/components/ui/custom-image';
import CustomLink from '@shared/components/ui/custom-link';
import Loading from '@shared/components/ui/loading';

function getSinunaServiceUrl() {
  if (getRuntimeStage() !== 'production') {
    return 'https://frontend.sunbackend.qa.sinuna.fi';
  }
  return 'https://itsepalvelu.tunnus.sinuna.fi';
}

export default function LoggedOutPage() {
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  const sinunaLoginServiceLink = getSinunaServiceUrl();
  const virtualFinlandLoginServiceLink = '/auth/sign-in';
  const { initiator, provider } = router.query;

  useEffect(() => {
    if (router.isReady) {
      if (initiator === 'auth-service') {
        window.history.replaceState(null, '', '/logged-out'); // Clear query params without redrawing
      } else {
        router.push('/'); // Redirect to home page if not flagged as coming from auth service
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
      <Page.Block className="bg-white">
        <Alert status="neutral">
          <div className="flex flex-col gap-3 items-start">
            <CustomHeading variant="h2">
              Logged out from Access Finland!
            </CustomHeading>
            {provider === AuthProvider.SINUNA && (
              <div className="flex flex-col gap-6">
                <Text>
                  You have logged out successfully from Access Finland. Note
                  that the Sinuna login session might still be active.
                </Text>
                <div className="flex items-start flex-wrap gap-6">
                  <div className="flex flex-col items-start gap-3">
                    <Text>
                      Manage your Sinuna login session in Sinuna Service.
                    </Text>
                    <Button
                      className="!w-auto"
                      onClick={() =>
                        window.open(sinunaLoginServiceLink, '_blank')
                      }
                    >
                      Sinuna service
                    </Button>
                  </div>
                  <CustomImage
                    src={SinunaLogo}
                    alt="Sinuna logo"
                    width={250}
                    priority
                  />
                </div>
              </div>
            )}
            {provider === AuthProvider.VIRTUALFINLAND && (
              <div className="flex flex-col gap-6">
                <Text>
                  You have logged out successfully from Access Finland. Note
                  that the Virtual Finland login session might still be active.
                </Text>
                <div className="flex items-start flex-wrap gap-6">
                  <div className="flex flex-col items-start gap-3">
                    <Text>
                      Manage your Virtual Finland login session in the Virtual
                      Finland sign in page.
                    </Text>
                    <Button
                      className="!w-auto"
                      onClick={() =>
                        window.open(virtualFinlandLoginServiceLink, '_blank')
                      }
                    >
                      Virtual Finland sign in page
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6">
            <CustomLink disableVisited href="/">
              Continue to Home page
            </CustomLink>
          </div>
        </Alert>
      </Page.Block>
    </Page>
  );
}
