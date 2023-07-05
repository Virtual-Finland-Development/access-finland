import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';
import { Button, IconArrowLeft, IconArrowRight } from 'suomifi-ui-components';
import { useCompanyContext } from '@shared/context/company-context';

interface Props {
  onFormActionClick: (next?: boolean) => void;
  isLastStep: boolean;
}

export default function CompanyWizardActionButtons(props: Props) {
  const { onFormActionClick, isLastStep } = props;
  const { step } = useCompanyContext();
  const {
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const { nationalIdentifier } = router.query;
  const companyRouteUrl = !nationalIdentifier
    ? '/company/establishment'
    : `/company/edit/${nationalIdentifier}`;

  const buttonsDisabled = Boolean(Object.keys(errors).length);

  const onNextClick = () => {
    if (isLastStep) {
      router.push(companyRouteUrl);
    } else {
      onFormActionClick(true);
    }
  };

  return (
    <>
      {step && step > 0 && step < 10 ? (
        <Button
          variant="secondary"
          icon={<IconArrowLeft />}
          onClick={() => onFormActionClick()}
        >
          Previous
        </Button>
      ) : null}
      <Button
        iconRight={<IconArrowRight />}
        onClick={onNextClick}
        disabled={buttonsDisabled}
      >
        Next
      </Button>
    </>
  );
}
