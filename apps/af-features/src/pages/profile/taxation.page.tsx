import { useEffect, useState } from 'react';
import veroLogo from '@shared/images/logo-vero.svg';
import { format, parseISO } from 'date-fns';
import { Text } from 'suomifi-ui-components';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomImage from '@shared/components/ui/custom-image';
import Loading from '@shared/components/ui/loading';
import PageSideNavLayout from './components/profile-side-nav-layout';

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

const DATA = {
  taxRate: 15.5,
  incomeLimitYear: 30000,
  incomeLimitRestOfYear: 27000,
  validityStart: '2023-01-01',
  validityEnd: '2023-12-31',
};

const MOCK_DATA = async () => {
  await sleep();
  return DATA;
};

function formatEuro(num) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(num);
}

export default function TaxationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<typeof DATA | undefined>();

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
      <PageSideNavLayout title="Taxation">
        <Page.Block className="bg-white">
          <div className="flex flex-col gap-6 items-start">
            <div className="flex flex-row items-center">
              <CustomHeading variant="h2" suomiFiBlue="dark">
                Your Taxation
              </CustomHeading>
            </div>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a
              diam eget felis aliquam dignissim. Sed euismod, nisl eget aliquam
              ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl
              vitae nunc.
            </Text>

            {isLoading ? (
              <Loading />
            ) : (
              <div className="flex flex-col gap-4">
                <Text>
                  Tax rate:{' '}
                  <span className="block font-semibold">{data!.taxRate} %</span>
                </Text>
                <Text>
                  Income limit for the whole year:{' '}
                  <span className="block font-semibold">
                    {formatEuro(data!.incomeLimitYear)}
                  </span>
                </Text>
                <Text>
                  Income limit for the rest of the year:{' '}
                  <span className="block font-semibold">
                    {formatEuro(data!.incomeLimitRestOfYear)}
                  </span>
                </Text>
                <Text>
                  Validity:{' '}
                  <span className="block font-semibold">
                    {format(parseISO(data!.validityStart), 'dd.MM.yyyy')} -{' '}
                    {format(parseISO(data!.validityEnd), 'dd.MM.yyyy')}
                  </span>
                </Text>

                <CustomImage src={veroLogo} alt="Vero" />
              </div>
            )}
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
