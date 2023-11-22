import { Text } from 'suomifi-ui-components';
import { usePersonIncomeTax } from '@shared/lib/hooks/employment';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';
import PageSideNavLayout from '../components/profile-side-nav-layout';
import TaxDetails from '../components/tax-details';

export default function IncomeTaxPage() {
  /**
   * TODO: implement consent check before fetching data
   */
  const { data: incomeTax, isLoading } = usePersonIncomeTax();

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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a
              diam eget felis aliquam dignissim. Sed euismod, nisl eget aliquam
              ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl
              vitae nunc.
            </Text>

            {isLoading ? <Loading /> : <TaxDetails data={incomeTax} />}
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
