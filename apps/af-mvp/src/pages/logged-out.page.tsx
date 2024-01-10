import { ImageProps } from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SinunaLogo from '@shared/images/sinuna-logo.svg';
import VFLogoInverted from '@shared/images/virtualfinland_logo_small_inverted.png';
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

function AuthProviderInfo(props: {
  image?: ImageProps['src'];
  imageWidth?: number;
  link: string;
  isExternalLink?: boolean;
  name: string;
}) {
  const { image, imageWidth = 200, link, isExternalLink = true, name } = props;
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <Text>
        You have logged out successfully from Access Finland. Note that the{' '}
        {name} login session might still be active.
      </Text>
      <div className="flex items-start flex-wrap gap-6">
        <div className="flex flex-col items-start gap-3">
          <Text>
            Manage your {name} login session in {name} Service.
          </Text>
          <Button
            className="!w-auto"
            onClick={() => {
              if (isExternalLink) {
                window.open(link, '_blank');
              } else {
                router.push(link);
              }
            }}
          >
            {name} Service
          </Button>
        </div>
        {image && (
          <CustomImage
            src={image}
            alt={`${name} logo`}
            width={imageWidth}
            priority
          />
        )}
      </div>
    </div>
  );
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
              <AuthProviderInfo
                image={SinunaLogo}
                link={sinunaLoginServiceLink}
                name="Sinuna"
              />
            )}
            {provider === AuthProvider.VIRTUALFINLAND && (
              <AuthProviderInfo
                image={VFLogoInverted}
                imageWidth={300}
                link={virtualFinlandLoginServiceLink}
                isExternalLink={false}
                name="Virtual Finland"
              />
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
