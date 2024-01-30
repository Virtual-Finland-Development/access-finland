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
import { Nace, PersonWorkPermit } from '@shared/types';
import { useNaceCodes } from '@shared/lib/hooks/codesets';
import Alert from '@shared/components/ui/alert';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomImage from '@shared/components/ui/custom-image';
import Loading from '@shared/components/ui/loading';

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

interface PermitExpanderProps {
  permit: PersonWorkPermit;
  naceCodes: Nace[];
}

function PermitExpander(props: PermitExpanderProps) {
  const { permit, naceCodes } = props;

  const industries = permit.industries.map(code => {
    const naceIndex = naceCodes.findIndex(n => n.dotNotationCodeValue === code);
    return {
      codeValue: code,
      label: naceIndex > -1 ? naceCodes[naceIndex].prefLabel.en : '',
    };
  });

  return (
    <Expander>
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
            <span className="block font-semibold">Validity</span>
            <span>
              {permit.validityStart && permit.validityEnd ? (
                <>
                  {format(parseISO(permit.validityStart!), 'dd.MM.yyyy')} -{' '}
                  {format(parseISO(permit.validityEnd!), 'dd.MM.yyyy')}
                </>
              ) : (
                <>&mdash;</>
              )}
            </span>
          </Text>
          <Text>
            <span className="block font-semibold">Employer</span>
            <span>{permit.employerName}</span>
          </Text>
          <Text>
            <span className="block font-semibold">Industries</span>
            {industries.map(i => (
              <span className="block" key={i.codeValue}>
                {i.codeValue} {i.label}
              </span>
            ))}
          </Text>
          <InlineAlert labelText="Permit type">
            <Text>1. Permit type, or the grounds for issuing the permit:</Text>
            <ul className="list-outside list-disc ms-8">
              <li>
                <Text
                  className={
                    permit.permitType === 'A' ? '!font-bold' : 'font-normal'
                  }
                >
                  A = continuous residence permit
                </Text>
              </li>
              <li>
                <Text
                  className={
                    permit.permitType === 'B' ? '!font-bold' : 'font-normal'
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
                  P-EU or P-EY = a long-term resident’s EU residence permit
                  issued to a third-country national.
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
              ? 'Work permit application has been accepted.'
              : 'Work permit application has been rejected. Reason: lorem ipsum dolor sit amet.'}
          </Text>
        </InlineAlert>
      </ExpanderContent>
    </Expander>
  );
}

interface Props {
  permits: PersonWorkPermit[] | undefined;
  error: any;
}

export default function PermitsDetails(props: Props) {
  const { permits, error } = props;

  const hasPermits = permits && permits.length > 0;

  const { data: naceCodes, isLoading } = useNaceCodes(hasPermits);

  if (error) {
    return (
      <Alert status="error" labelText="Error">
        Could not fetch person permits:{' '}
        {error.message || 'something went wrong'}
      </Alert>
    );
  }

  if (!hasPermits) {
    return <Text>You currently have no pending permits.</Text>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <CustomHeading variant="h3">Your permits</CustomHeading>
      <div className="flex flex-col gap-4 w-full">
        {permits.map((permit, index) => (
          <PermitExpander
            key={index}
            permit={permit}
            naceCodes={naceCodes || []}
          />
        ))}
        <Text>Issued by Migri</Text>
        <CustomImage src={migriLogo} alt="Migri" height={100} />
      </div>
    </>
  );
}
