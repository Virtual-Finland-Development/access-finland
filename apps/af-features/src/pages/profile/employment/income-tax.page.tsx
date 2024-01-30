import { Text } from 'suomifi-ui-components';
import { ConsentDataSource } from '@shared/types';
import { useDataSourceConsent } from '@shared/lib/hooks/consent';
import { usePersonIncomeTax } from '@shared/lib/hooks/employment';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';
import ConsentSentry from '../components/consent-sentry';
import PageSideNavLayout from '../components/profile-side-nav-layout';
import TaxDetails from '../components/tax-details';

export default function IncomeTaxPage() {
  // get consent situation for income tax
  const {
    data: consentSituation,
    giveConsent,
    error: consentError,
    isLoading: consentLoading,
  } = useDataSourceConsent(ConsentDataSource.INCOME_TAX);

  // get income tax, if consent is granted
  const {
    data: incomeTax,
    error: incomeTaxError,
    isLoading: incomeTaxLoading,
  } = usePersonIncomeTax(consentSituation);

  const isLoading = consentLoading || incomeTaxLoading;

  return (
    <AuthSentry redirectPath="/profile">
      <PageSideNavLayout title="Income Tax">
        <Page.Block className="bg-white">
          <div className="flex flex-col gap-6 items-start">
            <div className="flex flex-row items-center">
              <CustomHeading variant="h2" suomiFiBlue="dark">
                Income Tax
              </CustomHeading>
            </div>
            <Text>
              Here you’ll find a comprehensive overview of your tax details.
              This aims to provide clear insights into your tax contributions,
              deductions, and related specifics, ensuring transparency and ease
              of understanding regarding your financial obligations while
              working in Finland.
            </Text>

            {isLoading ? (
              <Loading />
            ) : (
              <ConsentSentry
                consentDataSource={ConsentDataSource.INCOME_TAX}
                consentSituation={consentSituation}
                giveConsent={giveConsent}
                error={consentError}
              >
                <TaxDetails incomeTax={incomeTax} error={incomeTaxError} />
              </ConsentSentry>
            )}
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
