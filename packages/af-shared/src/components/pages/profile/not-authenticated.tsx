import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import SinunaLogo from '@shared/images/sinuna-logo.svg';
import VFLogoInverted from '@shared/images/virtualfinland_logo_small_inverted.png';
import { Button, Checkbox, IconLogin, Text } from 'suomifi-ui-components';
import api from '@/lib/api';
import { isExportedApplication } from '@/lib/utils';
import Page from '@/components/layout/page';
import CustomHeading from '@/components/ui/custom-heading';
import CustomImage from '@/components/ui/custom-image';
import CustomLink from '@/components/ui/custom-link';

const isExport = isExportedApplication();

export default function ProfileNotAuthenticated() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const loginHandler = () => {
    setLoading(true);
    api.auth.directToAuthLogin('/profile');
  };

  // Resolve the auth method text
  const authMethod = isExport ? 'Testbed' : 'Sinuna';
  const infoTextPost = isExport
    ? `Granting permission for this account will help you
  to provide information only once and use it afterwords whenever
  needed.`
    : `Log in with Sinuna login service to create and manage Your personal
  profile and job applicant profile.`;

  return (
    <Page.Block className="bg-white">
      <CustomHeading variant="h2" suomiFiBlue="dark">
        Sign in to Your profile
      </CustomHeading>
      <div className="flex flex-col mt-8 gap-6 p-4 bg-suomifi-blue-bg-light">
        <CustomHeading variant="h3" className="!text-lg">
          About your personal profile account
        </CustomHeading>
        <Text>
          Sign in to Your digital profile. Any data we will ask is not for us -
          it is for you. {infoTextPost}
        </Text>
        {!isExport ? (
          <CustomImage
            src={SinunaLogo}
            alt="Sinuna logo"
            width={200}
            priority
          />
        ) : (
          <Fragment>
            <CustomLink href="/profile">How is my data used?</CustomLink>
            <Checkbox variant="large">Grant permissions</Checkbox>
          </Fragment>
        )}
      </div>
      <div className="flex flex-col items-start gap-4 mt-6">
        <Button
          onClick={loginHandler}
          disabled={isLoading}
          className="!w-auto"
          icon={<IconLogin />}
        >
          {isLoading ? 'Redirecting...' : `Sign in with ${authMethod}`}
        </Button>
      </div>
      {!isExport && (
        <>
          <div className="flex flex-col mt-8 gap-6 p-4 bg-suomifi-blue-bg-light">
            <CustomHeading variant="h3" className="!text-lg">
              Virtual Finland Sign-in
            </CustomHeading>
            <Text>
              Alternatively, you can sign in using your email address. A
              verification code will be sent to you.
            </Text>
            <Text>
              We utilize a one-time code verification process. Please enter your
              email address to receive a unique code that you can use to sign in
              securely. Once you’ve entered your email address, a one-time code
              will be sent to your inbox. Use that code to complete the sign-in
              process.
            </Text>
            <CustomImage
              src={VFLogoInverted}
              alt="Virtual Finland logo"
              width={300}
              priority
            />
          </div>
          <div className="flex flex-col items-start gap-4 mt-6">
            <Button
              onClick={() => router.push('/auth/sign-in')}
              icon={<IconLogin />}
            >
              Sign in with Virtual Finland
            </Button>
          </div>
        </>
      )}
    </Page.Block>
  );
}
