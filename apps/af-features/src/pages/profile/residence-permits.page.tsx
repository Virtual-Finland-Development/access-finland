import { useEffect, useState } from 'react';
import { MdCancel, MdDone, MdOutlineInfo } from 'react-icons/md';
import migriLogo from '@shared/images/MIGRI_logo.svg';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
  InlineAlert,
  Text,
} from 'suomifi-ui-components';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomImage from '@shared/components/ui/custom-image';
import Loading from '@shared/components/ui/loading';
import PageSideNavLayout from './components/profile-side-nav-layout';

interface Permit {
  id: number;
  issuer: string;
  type: string;
  status: string;
}

const STATUS_TEXTS = {
  completed: 'The residence permit application has been completed.',
  pending: "The residence permit application hasn't been processed yet.",
  rejected:
    'The residence permit application has been rejected. Reason: lorem ipsum dolor sit amet.',
};

const STATUS_VARIANT = {
  completed: 'success',
  pending: 'warning',
  rejected: 'error',
};

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

const MOCK_DATA = async () => {
  await sleep();
  return [
    { id: 1, issuer: 'Migri', type: 'A', status: 'completed' },
    { id: 2, issuer: 'Migri', type: 'B', status: 'pending' },
    { id: 3, issuer: 'Migri', type: 'P', status: 'rejected' },
  ];
};

function renderIcon(status: string) {
  switch (status) {
    case 'completed':
      return <MdDone size={22} color="green" />;
    case 'pending':
      return <MdOutlineInfo size={22} color="orange" />;
    case 'rejected':
      return <MdCancel size={22} color="red" />;
    default:
      return <MdOutlineInfo size={22} color="orange" />;
  }
}

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function PermitsInfo({ permits }: { permits: Permit[] | undefined }) {
  if (!permits || permits.length === 0) {
    return <Text>No residence permits.</Text>;
  }

  return permits?.map(permit => (
    <Expander key={permit.id}>
      <ExpanderTitleButton>
        <div className="flex flex-row gap-2 items-center">
          <span>{permit.issuer}</span> {renderIcon(permit.status)}
        </div>
      </ExpanderTitleButton>
      <ExpanderContent className="!text-base !flex !flex-col !gap-4">
        <div className="flex flex-col gap-4">
          <Text>
            1. Issuer: <span className="font-semibold">{permit.issuer}</span>
          </Text>
          <CustomImage src={migriLogo} alt="Migri" height={100} />
          <Text>
            2. Permit type: <span className="font-semibold">{permit.type}</span>
          </Text>
          <InlineAlert labelText="Permit type">
            <Text>1. Permit type, or the grounds for issuing the permit:</Text>
            <ul className="list-outside list-disc ms-8">
              <li>
                <Text
                  className={permit.type === 'A' ? '!font-bold' : 'font-normal'}
                >
                  A = continuous residence permit
                </Text>
              </li>
              <li>
                <Text
                  className={permit.type === 'B' ? '!font-bold' : 'font-normal'}
                >
                  B = temporary residence permit
                </Text>
              </li>
              <li>
                <Text
                  className={permit.type === 'P' ? '!font-bold' : 'font-normal'}
                >
                  P = permanent residence permit
                </Text>
              </li>
              <li>
                <Text>
                  P-EU or P-EY = a long-term resident’s EU residence permit
                  issued to a third-country national.
                </Text>
              </li>
            </ul>
          </InlineAlert>
          <Text>
            3. Status:{' '}
            <span className="font-semibold">{capitalize(permit.status)}</span>
          </Text>
        </div>
        <InlineAlert
          status={STATUS_VARIANT[permit.status]}
          labelText={capitalize(permit.status)}
        >
          <Text>{STATUS_TEXTS[permit.status]}</Text>
        </InlineAlert>
      </ExpanderContent>
    </Expander>
  ));
}

export default function ResidencePermitsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [permits, setPermits] = useState<Permit[] | undefined>();

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
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a
              diam eget felis aliquam dignissim. Sed euismod, nisl eget aliquam
              ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl
              vitae nunc.
            </Text>

            {isLoading ? <Loading /> : <PermitsInfo permits={permits} />}
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
