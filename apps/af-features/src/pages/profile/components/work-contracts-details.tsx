import { Text } from 'suomifi-ui-components';
import { WorkContract } from '@shared/types';
import { WORK_CONTRACT_LABELS } from '@shared/lib/constants';
import CustomHeading from '@shared/components/ui/custom-heading';
import DetailsExpander from '@shared/components/ui/details-expander/details-expander';

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
            // values={jobApplicationProfileMapped || {}}
            values={contract}
            labels={WORK_CONTRACT_LABELS}
            hasValues
            showStatusIcons={false}
          />
        ))}
      </div>
    </>
  );
}
