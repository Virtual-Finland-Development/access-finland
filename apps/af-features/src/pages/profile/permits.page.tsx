import { useEffect, useState } from 'react';
import migriLogo from '@shared/images/MIGRI_logo.svg';
import { Text } from 'suomifi-ui-components';
import { PersonWorkPermit } from '@shared/types';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomImage from '@shared/components/ui/custom-image';
import Loading from '@shared/components/ui/loading';
import PermitsDetails from './components/permits-details';
import PageSideNavLayout from './components/profile-side-nav-layout';

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

const DATA: PersonWorkPermit[] = [
  {
    permitName: 'Seasonal work certificate',
    permitAccepted: true,
    permitType: 'A',
    validityStart: '2023-11-07',
    validityEnd: '2024-02-19',
    industries: ['79.1', '79.9'],
    employerName: 'Staffpoint Oy',
  },
  {
    permitName: 'First residence permit',
    permitAccepted: false,
    permitType: 'B',
    validityStart: '',
    validityEnd: '',
    industries: ['89.1', '89.9'],
    employerName: 'Staffpoint Oy',
  },
];

async function MOCK_DATA(): Promise<PersonWorkPermit[]> {
  await sleep();
  return DATA;
}

export default function ResidencePermitsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [permits, setPermits] = useState<PersonWorkPermit[] | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await MOCK_DATA();
        setPermits(response);
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
      <PageSideNavLayout title="Permits">
        <Page.Block className="bg-white">
          <div className="flex flex-col gap-6 items-start">
            <div className="flex flex-row items-center">
              <CustomHeading variant="h2" suomiFiBlue="dark">
                Permits
              </CustomHeading>
            </div>
            <div className="flex flex-col gap-2">
              <Text>
                Finnish Immigration Service (Migri) is the organization in
                charge of managing immigration, asylum, residency permits, and
                citizenship processes in Finland, helping people navigate legal
                requirements and settle into life in the country. Here you can
                find information about your residence permits issued by Migri.
              </Text>
              <Text></Text>
              <CustomImage src={migriLogo} alt="Migri" height={100} />
            </div>
            {isLoading ? <Loading /> : <PermitsDetails permits={permits} />}
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
