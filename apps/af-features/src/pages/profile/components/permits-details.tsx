import { MdCancel, MdDone, MdOutlineInfo } from 'react-icons/md';
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
import CustomHeading from '@shared/components/ui/custom-heading';

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

interface Props {
  permits: PersonWorkPermit[] | undefined;
}

export default function PermitsDetails(props: Props) {
  const { permits } = props;

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
