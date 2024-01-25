import staffPointLogo from '@shared/images/staffpoint.svg';
import { format, parseISO } from 'date-fns';
import { Text } from 'suomifi-ui-components';
import { WorkContract } from '@shared/types';
import { WORK_CONTRACT_LABELS } from '@shared/lib/constants';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomImage from '@shared/components/ui/custom-image';
import DetailsExpander from '@shared/components/ui/details-expander/details-expander';

const formatDate = (date: string) => format(parseISO(date), 'dd.MM.yyyy');

function mapContractDetails(contract: WorkContract) {
  const {
    employerInfo: { signatureDate: employerSignatureDate, ...employerInfo },
    employeeInfo: { signatureDate: employeeSignatureDate, ...employeeInfo },
    termsOfWork: { employmentStart, employmentEnd, locations, ...termsOfWork },
    compensation,
    benefits,
    holidays,
  } = contract;

  const mapped = {
    ...contract,
    employerInfo: {
      ...employerInfo,
      signatureDate: formatDate(employerSignatureDate),
    },
    employeeInfo: {
      ...employeeInfo,
      signaruteDate: formatDate(employeeSignatureDate),
    },
    termsOfWork: {
      ...termsOfWork,
      employmentStart: formatDate(employmentStart),
      employmentEnd: employmentEnd ? formatDate(employmentEnd) : '-',
      locations: locations ? locations.join(', ') : '',
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
  contract: WorkContract | undefined;
}

export default function WorkContractsDetails(props: Props) {
  const { contract } = props;

  if (!contract) {
    return <Text>You currently have no work contracts.</Text>;
  }

  return (
    <>
      <CustomHeading variant="h3">Your work contracts</CustomHeading>
      <div className="flex flex-col gap-4 w-full">
        <DetailsExpander<WorkContract>
          title={contract.employerInfo.name}
          values={mapContractDetails(contract)}
          labels={WORK_CONTRACT_LABELS}
          hasValues
          showStatusIcons={false}
        />
        <Text>Issued by StaffPoint</Text>
        <CustomImage src={staffPointLogo} alt="StaffPoint" height={50} />
      </div>
    </>
  );
}
