import { useCallback } from 'react';
import {
  RouterLink,
  WizardNavigation,
  WizardNavigationItem,
  WizardNavigationItemProps,
} from 'suomifi-ui-components';
import useDimensions from '@shared/lib/hooks/use-dimensions';
import { useCompanyContext } from '@shared/context/company-context';
import { Step } from '@shared/context/company-context';

type NavStep = { label: string; step: Step };
type WizardType = 'company' | 'beneficialOwners' | 'signatoryRights';

const COMPANY_STEPS: NavStep[] = [
  {
    label: '1. Registrant',
    step: 'company.registrant',
  },
  {
    label: '2. Company details',
    step: 'company.companyDetails',
  },
  {
    label: '3. Company address',
    step: 'company.companyAddress',
  },
  {
    label: '4. Share series',
    step: 'company.shareSeries',
  },
  {
    label: '5. Managing directors',
    step: 'company.managingDirectors',
  },
  {
    label: '6. Board members',
    step: 'company.boardMembers',
  },
  {
    label: '7. Auditor',
    step: 'company.auditorDetails',
  },
];

const BENEFICIAL_OWNER_STEPS: NavStep[] = [
  { label: '1. Share series', step: 'beneficialOwners.shareSeries' },
  {
    label: '2. Shareholders',
    step: 'beneficialOwners.shareholders',
  },
];

const SIGNATORY_RIGHTS_STEPS: NavStep[] = [
  {
    label: '1. Signatory rights',
    step: 'signatoryRights.signatoryRights',
  },
];

interface Props {
  wizardType: WizardType;
  onWizardNavChange: (clickedStep: number) => void;
}

function navSettings(wizardType: WizardType) {
  switch (wizardType) {
    case 'company':
      return { navHeading: 'Details', navSteps: COMPANY_STEPS };
    case 'beneficialOwners':
      return {
        navHeading: 'Beneficial owners',
        navSteps: BENEFICIAL_OWNER_STEPS,
      };
    case 'signatoryRights':
      return {
        navHeading: 'Signatory rights',
        navSteps: SIGNATORY_RIGHTS_STEPS,
      };
  }
}

export default function CompanyWizardNav(props: Props) {
  const { wizardType, onWizardNavChange } = props;
  const { width } = useDimensions();
  const { isStepDone, isPrevStepDone, doneSteps, step } = useCompanyContext();

  const { navHeading, navSteps } = navSettings(wizardType);

  const trackedDoneSteps = Object.keys(doneSteps)
    .filter(key => key.includes(wizardType))
    .reduce((cur, key) => {
      return Object.assign(cur, { [key]: doneSteps[key as Step] });
    }, {});
  const doneStepValues = Object.values(trackedDoneSteps);
  const allStepsDone =
    doneStepValues.length === navSteps.length &&
    doneStepValues.every(isDone => isDone);

  const getItemStatus = useCallback(
    (
      step: Step,
      index: number,
      currentStepNum: number
    ): WizardNavigationItemProps['status'] => {
      if (doneStepValues.length) {
        if (currentStepNum === index) {
          return isStepDone(step) ? 'current-completed' : 'current';
        } else if (doneStepValues.some((isDone, i) => i < index && !isDone)) {
          return 'coming';
        }
      }

      if (currentStepNum === index) {
        return isStepDone(step) ? 'current-completed' : 'current';
      } else {
        if (isStepDone(step)) {
          return 'completed';
        } else {
          return isPrevStepDone(step) ? 'default' : 'coming';
        }
      }
    },
    [doneStepValues, isPrevStepDone, isStepDone]
  );

  return (
    <WizardNavigation
      heading={navHeading}
      aria-label="Company establishment wizard steps"
      initiallyExpanded={false}
      variant={width > 1024 ? 'default' : 'smallScreen'}
    >
      {navSteps.map((item, index) => {
        const status = getItemStatus(item.step, index, step);

        return (
          <WizardNavigationItem key={item.step} status={status}>
            <RouterLink onClick={() => onWizardNavChange(index)}>
              {item.label}
            </RouterLink>
          </WizardNavigationItem>
        );
      })}
      <WizardNavigationItem
        status={
          allStepsDone
            ? step === navSteps.length
              ? 'current-completed'
              : 'default'
            : 'coming'
        }
      >
        <RouterLink onClick={() => onWizardNavChange(navSteps.length)}>
          {`${navSteps.length + 1}.`} Preview
        </RouterLink>
      </WizardNavigationItem>
    </WizardNavigation>
  );
}
