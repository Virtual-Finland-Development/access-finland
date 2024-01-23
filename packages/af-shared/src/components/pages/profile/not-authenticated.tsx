import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import SinunaLogo from '@shared/images/sinuna-logo.svg';
import VFLogoInverted from '@shared/images/virtualfinland_logo_small_inverted.png';
import { isAfter, isSameDay } from 'date-fns';
import { Button, Checkbox, IconLogin, Text } from 'suomifi-ui-components';
import api from '@/lib/api';
import { isExportedApplication } from '@/lib/utils';
import Page from '@/components/layout/page';
import Alert from '@/components/ui/alert';
import CustomHeading from '@/components/ui/custom-heading';
import CustomImage from '@/components/ui/custom-image';
import CustomLink from '@/components/ui/custom-link';

const isExport = isExportedApplication();

// Sinuna auth disabled on 28th of February, 2024
// The date was mentioned here: https://www.tivi.fi/uutiset/gdpr-huoliin-ratkaisua-luvannut-kotimainen-kirjautumispalvelu-lakkautetaan/4a022e33-1e9a-4d2d-bad3-a41df6d67e5c
export function isSinunaDisabled(date?: Date | undefined) {
  const currentDate = date || new Date();
  const targetDate = new Date(Date.UTC(2024, 1, 28, 2)); // 28th of February, 2024 in Finnish time (UTC+2)
  // Convert current UTC date to Finnish time (UTC+2)
  const finnishDate = new Date(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
    currentDate.getUTCDate(),
    currentDate.getUTCHours() + 2,
    currentDate.getUTCMinutes(),
    currentDate.getUTCSeconds()
  );
  return isSameDay(finnishDate, targetDate) || isAfter(finnishDate, targetDate);
}

export default function ProfileNotAuthenticated() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const loginHandler = () => {
    setLoading(true);
    api.auth.directToAuthLogin('/profile');
  };

  // Disable Sinuna login if the date is 28th of February, 2024
  const sinunaDisabled = !isExport && isSinunaDisabled();

  // Resolve the auth method text
  const authMethod = isExport ? 'Testbed' : 'Sinuna';
  const infoTextPost = isExport
    ? `Granting permission for this account will help you
  to provide information only once and use it afterwords whenever
  needed.`
    : `Log in with Sinuna login service to create and manage Your personal
  profile and job applicant profile.`;
  // Resolve sinuna info text
  const sinunaInfoText = !sinunaDisabled
    ? `Sinuna login service will be disabled on 28th of February, 2024. After that date, you can use Virtual Finland login service to sign-in.`
    : `Sinuna login service has been disabled as of 28th of February, 2024. You can use Virtual Finland login service to sign-in.`;

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
          <>
            <CustomImage
              src={SinunaLogo}
              alt="Sinuna logo"
              width={200}
              priority
            />
            <Alert status="warning">
              <Text className="!text-base">{sinunaInfoText}</Text>
            </Alert>
          </>
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
          disabled={isLoading || sinunaDisabled}
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
              Alternatively, you can sign in using your email address with
              Virtual Finland login service. A verification code will be sent to
              you.
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
