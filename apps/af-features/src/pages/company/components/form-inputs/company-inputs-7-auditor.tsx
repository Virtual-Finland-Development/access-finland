import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import lodash_get from 'lodash.get';
import type { AuditorDetails } from '@shared/types';
import { useCompanyContext } from '@shared/context/company-context';
import FormInput from '@shared/components/form/form-input';
import CustomHeading from '@shared/components/ui/custom-heading';

interface FieldProps {
  company: {
    auditorDetails: AuditorDetails;
  };
}

export default function CompanyAuditor() {
  const {
    values: { company },
    setIsCurrentStepDone,
  } = useCompanyContext();
  const { control, formState, getFieldState } = useFormContext<FieldProps>();
  const { invalid } = getFieldState('company.auditorDetails', formState);

  const isStepDone = useMemo(() => {
    const hasContextValues = lodash_get(company, 'auditorDetails');
    return hasContextValues ? !invalid : formState.isValid;
  }, [company, formState.isValid, invalid]);

  useEffect(() => {
    setIsCurrentStepDone('company.auditorDetails', isStepDone);
  }, [isStepDone, setIsCurrentStepDone]);

  return (
    <div className="flex flex-col gap-4 items-start">
      <div>
        <CustomHeading variant="h4">Stage 7/8</CustomHeading>
        <CustomHeading variant="h2">Auditor</CustomHeading>
      </div>
      <FormInput
        name={`company.auditorDetails.companyName`}
        control={control}
        labelText="Auditor company name"
        optionalText="Optional"
      />
      <FormInput
        name={`company.auditorDetails.nationalIdentifier`}
        control={control}
        labelText="National identifier"
        hintText="The national identifier of the non-listed company issued by the trade register"
        optionalText="Optional"
      />
      <FormInput
        name={`company.auditorDetails.givenName`}
        control={control}
        labelText="Auditor given name"
        optionalText="Optional"
      />
      <FormInput
        name={`company.auditorDetails.lastName`}
        control={control}
        labelText="Auditor last name"
        optionalText="Optional"
      />
    </div>
  );
}
