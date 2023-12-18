import { ReactNode } from 'react';
import { Button, InlineAlert, Text } from 'suomifi-ui-components';
import {
  ConsentDataSource,
  ConsentSituation,
  ConsentStatus,
} from '@shared/types';
import Alert from '@shared/components/ui/alert';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomLink from '@shared/components/ui/custom-link';

const SERVICE = {
  [ConsentDataSource.WORK_PERMIT]: 'Finnish Immigration Service (Migri)',
  [ConsentDataSource.INCOME_TAX]: 'Finnish Tax Administration (Vero)',
};

interface Props {
  consentDataSource: ConsentDataSource;
  consentSituation: ConsentSituation | undefined;
  giveConsent: () => void;
  error?: any;
  children: ReactNode;
}

export default function ConsentSentry(props: Props) {
  const { consentDataSource, consentSituation, giveConsent, error, children } =
    props;

  if (error) {
    return (
      <Alert status="error" labelText="Error">
        Could not verify consent situation:{' '}
        {error.message || 'something went wrong'}
      </Alert>
    );
  }

  const service = SERVICE[consentDataSource];

  return (
    <>
      {consentSituation?.consentStatus === ConsentStatus.GRANTED ? (
        <>
          <div className="flex flex-col">
            <Text className="!text-base">
              You have given your consent to {service}. You can revoke it{' '}
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
              Note that after revoking, you may need to reload this page to see
              the effect.
            </Text>
          </div>
          {children}
        </>
      ) : (
        <InlineAlert status="neutral">
          <div className="flex flex-col items-start gap-6">
            <CustomHeading variant="h3">Consent required</CustomHeading>
            <Text>
              We need your consent for {service}. You can give it below.
            </Text>
            <div className="flex flex-row items-center gap-3">
              <Button onClick={giveConsent}>Give consent</Button>
            </div>
          </div>
        </InlineAlert>
      )}
    </>
  );
}
