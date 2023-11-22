import { format, parseISO } from 'date-fns';
import { Text } from 'suomifi-ui-components';
import { WorkContract } from '@shared/types';
import { WORK_CONTRACT_LABELS } from '@shared/lib/constants';
import CustomHeading from '@shared/components/ui/custom-heading';
import DetailsExpander from '@shared/components/ui/details-expander/details-expander';

const formatDate = (date: string) => format(parseISO(date), 'dd.MM.yyyy');

function mapContractDetails(contract: WorkContract) {
  const {
    employerInfo: { signatureDate, ...employerInfo },
    employeeInfo: { signaruteDate, ...employeeInfo },
    termsOfWork: { employmentStart, employmentEnd, ...termsOfWork },
    compensation,
    benefits,
    holidays,
  } = contract;

  const mapped = {
    ...contract,
    employerInfo: {
      ...employerInfo,
      signatureDate: formatDate(signatureDate),
    },
    employeeInfo: {
      ...employeeInfo,
      signaruteDate: formatDate(signaruteDate),
    },
    termsOfWork: {
      ...termsOfWork,
      employmentStart: formatDate(employmentStart),
      employmentEnd: employmentEnd ? formatDate(employmentEnd) : '-',
    },
    compensation: {
      ...compensation,
      salary: `${compensation.salary} €`,
    },
    ...(benefits && {
      benefits: benefits.map(benefit => ({
        ...benefit,
        taxableValue: `${benefit.taxableValue} €`,
      })),
    }),
    ...(holidays && {
      holidays: {
        ...holidays,
        paidHoliday: holidays.paidHoliday ? 'Yes' : 'No',
      },
    }),
  };

  return mapped;
}

interface Props {
  contracts: WorkContract[] | undefined;
}

export default function WorkContractsDetails(props: Props) {
  const { contracts } = props;

  if (!contracts || contracts.length === 0) {
    return <Text>You currently have no work contracts.</Text>;
  }

  return (
    <>
      <CustomHeading variant="h3">Your work contracts</CustomHeading>
      <div className="flex flex-col gap-4 w-full">
        {contracts.map((contract, index) => (
          <DetailsExpander<WorkContract>
            key={index}
            title={contract.employerInfo.name}
            values={mapContractDetails(contract)}
            labels={WORK_CONTRACT_LABELS}
            hasValues
            showStatusIcons={false}
          />
        ))}
      </div>
    </>
  );
}
