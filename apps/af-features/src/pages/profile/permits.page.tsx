import { useEffect, useState } from 'react';
import { MdCancel, MdDone, MdOutlineInfo } from 'react-icons/md';
import migriLogo from '@shared/images/MIGRI_logo.svg';
import { format, parseISO } from 'date-fns';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
  InlineAlert,
  InlineAlertProps,
  Text,
} from 'suomifi-ui-components';
import { PersonWorkPermit } from '@shared/types';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomImage from '@shared/components/ui/custom-image';
import Loading from '@shared/components/ui/loading';
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

function getStatusColor(status: boolean) {
  switch (status) {
    case true:
      return 'text-green-700';
    case false:
      return 'text-red-600';
    default:
      return 'text-orange-400';
  }
}

function renderIcon(status: boolean) {
  switch (status) {
    case true:
      return <MdDone size={22} />;
    case false:
      return <MdCancel size={22} />;
    default:
      return <MdOutlineInfo size={22} />;
  }
}

function PermitsInfo({ permits }: { permits: PersonWorkPermit[] | undefined }) {
  if (!permits || permits.length === 0) {
    return <Text>You currently have no pending permits.</Text>;
  }

  return (
    <>
      <CustomHeading variant="h3">Your permits</CustomHeading>
      <div className="flex flex-col gap-4 w-full">
        {permits.map((permit, index) => (
          <Expander key={index}>
            <ExpanderTitleButton>
              <div className="flex flex-row gap-2 items-center">
                <span>{permit.permitName}</span>
                <span
                  className={`flex items-center gap-1 ${getStatusColor(
                    permit.permitAccepted
                  )}`}
                >
                  {renderIcon(permit.permitAccepted)}{' '}
                  {permit.permitAccepted ? 'Accepted' : 'Rejected'}
                </span>
              </div>
            </ExpanderTitleButton>
            <ExpanderContent className="!text-base !flex !flex-col !gap-4">
              <div className="flex flex-col gap-4">
                <Text>
                  Validity{' '}
                  <span className="block font-semibold">
                    {permit.validityStart && permit.validityEnd ? (
                      <>
                        {format(parseISO(permit.validityStart!), 'dd.MM.yyyy')}{' '}
                        - {format(parseISO(permit.validityEnd!), 'dd.MM.yyyy')}
                      </>
                    ) : (
                      <>&mdash;</>
                    )}
                  </span>
                </Text>
                <Text>
                  Employer{' '}
                  <span className="block font-semibold">
                    {permit.employerName}
                  </span>
                </Text>
                {permit.industries && (
                  <Text>
                    Industries{' '}
                    <span className="block font-semibold">
                      {permit.industries!.join(', ')}
                    </span>
                  </Text>
                )}
                <InlineAlert labelText="Permit type">
                  <Text>
                    1. Permit type, or the grounds for issuing the permit:
                  </Text>
                  <ul className="list-outside list-disc ms-8">
                    <li>
                      <Text
                        className={
                          permit.permitType === 'A'
                            ? '!font-bold'
                            : 'font-normal'
                        }
                      >
                        A = continuous residence permit
                      </Text>
                    </li>
                    <li>
                      <Text
                        className={
                          permit.permitType === 'B'
                            ? '!font-bold'
                            : 'font-normal'
                        }
                      >
                        B = temporary residence permit
                      </Text>
                    </li>
                    <li>
                      <Text className="font-normal">
                        P = permanent residence permit
                      </Text>
                    </li>
                    <li>
                      <Text>
                        P-EU or P-EY = a long-term resident’s EU residence
                        permit issued to a third-country national.
                      </Text>
                    </li>
                  </ul>
                </InlineAlert>
              </div>
              <InlineAlert
                status={
                  permit.permitAccepted
                    ? ('success' as InlineAlertProps['status'])
                    : 'error'
                }
                labelText={permit.permitAccepted ? 'Accepted' : 'Rejected'}
              >
                <Text>
                  {permit.permitAccepted
                    ? 'The residence permit application has been accepted.'
                    : 'The residence permit application has been rejected. Reason: lorem ipsum dolor sit amet.'}
                </Text>
              </InlineAlert>
            </ExpanderContent>
          </Expander>
        ))}
      </div>
    </>
  );
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
      <PageSideNavLayout title="Residence permits">
        <Page.Block className="bg-white">
          <div className="flex flex-col gap-6 items-start">
            <div className="flex flex-row items-center">
              <CustomHeading variant="h2" suomiFiBlue="dark">
                Residence permits
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
            {isLoading ? <Loading /> : <PermitsInfo permits={permits} />}
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
