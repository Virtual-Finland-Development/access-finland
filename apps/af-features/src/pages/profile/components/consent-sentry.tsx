import { ReactNode } from 'react';
import { Button, InlineAlert, Text } from 'suomifi-ui-components';
import { ConsentSituation, ConsentStatus } from '@shared/types';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomLink from '@shared/components/ui/custom-link';

interface Props {
  consentSituation: ConsentSituation | undefined;
  giveConsent: () => void;
  children: ReactNode;
}

export default function ConsentSentry(props: Props) {
  const { consentSituation, giveConsent, children } = props;

  return (
    <>
      {consentSituation?.consentStatus === ConsentStatus.GRANTED ? (
        <>
          <div className="flex flex-col">
            <Text className="!text-base">
              You have given your consent to service X. You can revoke it{' '}
              <CustomLink
                href="https://consent.testbed.fi"
                isExternal
                disableVisited
                $base
              >
                here.
              </CustomLink>
            </Text>
            <Text className="!text-base">
              Note that after revoking, you will need to reload this page to see
              the effect.
            </Text>
          </div>
          {children}
        </>
      ) : (
        <InlineAlert status="neutral">
          <div className="flex flex-col items-start gap-6">
            <CustomHeading variant="h3">Consent required</CustomHeading>
            <Text>We need your consent for service X. Give it below.</Text>
            <div className="flex flex-row items-center gap-3">
              <Button onClick={giveConsent}>Give consent</Button>
            </div>
          </div>
        </InlineAlert>
      )}
    </>
  );
}
