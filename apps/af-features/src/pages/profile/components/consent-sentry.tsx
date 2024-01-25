import { ReactNode } from 'react';
import {
  Button,
  IconChevronRight,
  InlineAlert,
  InlineAlertProps,
  Text,
} from 'suomifi-ui-components';
import {
  ConsentDataSource,
  ConsentSituation,
  ConsentStatus,
} from '@shared/types';
import Alert from '@shared/components/ui/alert';
import CustomLink from '@shared/components/ui/custom-link';

const SERVICE = {
  [ConsentDataSource.WORK_PERMIT]: 'Finnish Immigration Service (Migri)',
  [ConsentDataSource.INCOME_TAX]: 'Finnish Tax Administration (Vero)',
  [ConsentDataSource.WORK_CONTRACT]: 'StaffPoint',
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
          <InlineAlert
            status={'custom' as InlineAlertProps['status']}
            labelText="Consent given"
          >
            <div className="flex flex-col gap-4">
              <Text className="!text-base">
                You have given your consent to <strong>{service}</strong>. Note
                that if you make any changes to your consents, you may need to
                reload this page to see the effect.
              </Text>
              <div className="flex flex-row gap-1 items-center">
                <IconChevronRight className="-ml-1 text-base flex-shrink-0 text-suomifi-orange" />
                <CustomLink
                  href="https://consent.testbed.fi"
                  isExternal
                  disableVisited
                  $base
                >
                  Manage my consents in Consent Portal
                </CustomLink>
              </div>
            </div>
          </InlineAlert>

          {children}
        </>
      ) : (
        <InlineAlert status="neutral" labelText="Consent required">
          <div className="flex flex-col items-start gap-4">
            <Text className="!text-base">
              We need your consent for <strong>{service}</strong>. You can give
              it below.
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
