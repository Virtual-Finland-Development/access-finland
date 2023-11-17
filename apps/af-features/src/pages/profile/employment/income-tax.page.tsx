import { useEffect, useState } from 'react';
import veroLogo from '@shared/images/logo-vero.svg';
import { format, getYear, parseISO } from 'date-fns';
import { Text } from 'suomifi-ui-components';
import { IncomeTax } from '@shared/types';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomImage from '@shared/components/ui/custom-image';
import Loading from '@shared/components/ui/loading';
import PageSideNavLayout from '../components/profile-side-nav-layout';

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

function formatEuro(num) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(num);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function TaxInfo({ data }: { data: typeof DATA | undefined }) {
  if (!data) {
    return <Text>No tax information found.</Text>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Text>
        Tax payer type:{' '}
        <span className="block font-semibold">
          {capitalizeFirstLetter(data.taxPayerType)}
        </span>
      </Text>
      <Text>
        Tax rate:{' '}
        <span className="block font-semibold">
          {data.withholdingPercentage} %
        </span>
      </Text>
      <Text>
        Income limit for the year {getYear(new Date(data.validityDate))}:{' '}
        <span className="block font-semibold">
          {formatEuro(data.incomeLimit)}
        </span>
      </Text>
      <Text>
        Validity:{' '}
        <span className="block font-semibold">
          {format(parseISO(data.validityDate), 'dd.MM.yyyy')}
        </span>
      </Text>
      <Text>Issued by Vero</Text>
      <CustomImage src={veroLogo} alt="Vero" />
    </div>
  );
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
                Your income tax in Finland
              </CustomHeading>
            </div>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a
              diam eget felis aliquam dignissim. Sed euismod, nisl eget aliquam
              ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl
              vitae nunc.
            </Text>

            {isLoading ? <Loading /> : <TaxInfo data={data} />}
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
