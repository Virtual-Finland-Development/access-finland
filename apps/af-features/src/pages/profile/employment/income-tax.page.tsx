import { useEffect, useState } from 'react';
import { Text } from 'suomifi-ui-components';
import { IncomeTax } from '@shared/types';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';
import PageSideNavLayout from '../components/profile-side-nav-layout';
import TaxDetails from '../components/tax-details';

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

const DATA = {
  taxPayerType: 'resident' as IncomeTax['taxPayerType'],
  withholdingPercentage: 15.5,
  additionalPercentage: 40.2,
  incomeLimit: 30000,
  validityDate: '2023-12-31',
};

async function MOCK_DATA() {
  await sleep();
  return DATA;
}

export default function IncomeTaxPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IncomeTax | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await MOCK_DATA();
        setData(response);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

            {isLoading ? <Loading /> : <TaxDetails data={data} />}
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
