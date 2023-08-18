import { useRouter } from 'next/router';
import { Button } from 'suomifi-ui-components';
import {
  BenecifialOwners,
  NonListedCompany,
  SignatoryRights,
} from '@shared/types';
import { COMPANY_DATA_LABELS } from '@shared/lib/constants';
import { useCompanyContext } from '@shared/context/company-context';
import type { Step } from '@shared/context/company-context';
import CustomHeading from '@shared/components/ui/custom-heading';
import DetailsExpander from '@shared/components/ui/details-expander/details-expander';

interface Props {
  previewType: 'all' | 'company' | 'beneficialOwners' | 'signatoryRights';
  stageHeader?: string;
}

function isAllStepsDone(
  type: 'company' | 'beneficialOwners' | 'signatoryRights',
  doneSteps: Record<Step, boolean>
) {
  const trackedDoneSteps = Object.keys(doneSteps)
    .filter(key => key.includes(type))
    .reduce((cur, key) => {
      return Object.assign(cur, { [key]: doneSteps[key as Step] });
    }, {});
  const doneStepValues = Object.values(trackedDoneSteps);
  const allStepsDone = doneStepValues.every(isDone => isDone);
  return allStepsDone;
}

function EditActions({
  onEditClick,
  onClearClick,
}: {
  onEditClick: () => void;
  onClearClick: () => void;
}) {
  return (
    <div className="flex flex-row gap-4 mt-8">
      <Button onClick={onEditClick}>Edit information</Button>
      <Button variant="secondary" onClick={onClearClick}>
        Clear data
      </Button>
    </div>
  );
}

export default function Preview(props: Props) {
  const { previewType, stageHeader } = props;
  const {
    clearValues,
    values: { company, beneficialOwners, signatoryRights },
    doneSteps,
  } = useCompanyContext();
  const router = useRouter();
  const { nationalIdentifier } = router.query;
  const editUrlBase = !nationalIdentifier
    ? '/company/establishment'
    : `/company/edit/${nationalIdentifier}`;

  return (
    <div className="flex flex-col gap-4 w-full">
      {previewType !== 'all' && (
        <div>
          {stageHeader && (
            <CustomHeading variant="h4">{stageHeader}</CustomHeading>
          )}
          <CustomHeading variant="h2">Preview</CustomHeading>
        </div>
      )}

      {['all', 'company'].includes(previewType) && (
        <DetailsExpander<Partial<NonListedCompany>>
          title={previewType === 'all' ? '1. Details' : 'Details'}
          values={company}
          labels={COMPANY_DATA_LABELS}
          hasValues={isAllStepsDone('company', doneSteps)}
        >
          {previewType === 'all' && (
            <EditActions
              onEditClick={() => router.push(`${editUrlBase}/details`)}
              onClearClick={() => {
                clearValues('company');
                window.scrollTo(0, 0);
              }}
            />
          )}
        </DetailsExpander>
      )}

      {['all', 'beneficialOwners'].includes(previewType) && (
        <DetailsExpander<Partial<BenecifialOwners>>
          title={
            previewType === 'all' ? '2. Beneficial owners' : 'Beneficial owners'
          }
          values={beneficialOwners}
          labels={COMPANY_DATA_LABELS}
          hasValues={isAllStepsDone('beneficialOwners', doneSteps)}
        >
          {previewType === 'all' && (
            <EditActions
              onEditClick={() =>
                router.push(`${editUrlBase}/beneficial-owners`)
              }
              onClearClick={() => {
                clearValues('beneficialOwners');
                window.scrollTo(0, 0);
              }}
            />
          )}
        </DetailsExpander>
      )}
      {['all', 'signatoryRights'].includes(previewType) && (
        <DetailsExpander<SignatoryRights>
          title={
            previewType === 'all' ? '3. Signatory rights' : 'Signatory rights'
          }
          values={signatoryRights}
          labels={COMPANY_DATA_LABELS}
          hasValues={isAllStepsDone('signatoryRights', doneSteps)}
        >
          {previewType === 'all' && (
            <EditActions
              onEditClick={() => router.push(`${editUrlBase}/signatory-rights`)}
              onClearClick={() => {
                clearValues('signatoryRights');
                window.scrollTo(0, 0);
              }}
            />
          )}
        </DetailsExpander>
      )}
    </div>
  );
}
