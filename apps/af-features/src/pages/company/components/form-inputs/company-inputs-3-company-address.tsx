import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import lodash_get from 'lodash.get';
import type { CompanyAddress } from '@shared/types';
import { useCompanyContext } from '@shared/context/company-context';
import FormInput from '@shared/components/form/form-input';
import CustomHeading from '@shared/components/ui/custom-heading';

interface FieldProps {
  company: {
    companyAddress: CompanyAddress;
  };
}

const REQUIRED_FIELDS = ['fullAddress'];

export default function CompanyAddress() {
  const {
    values: { company },
    setIsCurrentStepDone,
  } = useCompanyContext();
  const { control, formState, getFieldState } = useFormContext<FieldProps>();
  const { invalid } = getFieldState('company.companyAddress', formState);

  const isStepDone = useMemo(() => {
    const hasContextValues = REQUIRED_FIELDS.every(field =>
      lodash_get(company?.companyAddress, field)
    );
    return hasContextValues ? !invalid : formState.isValid;
  }, [company?.companyAddress, formState.isValid, invalid]);

  useEffect(() => {
    setIsCurrentStepDone('company.companyAddress', isStepDone);
  }, [isStepDone, setIsCurrentStepDone]);

  return (
    <div className="flex flex-col gap-4 items-start">
      <div>
        <CustomHeading variant="h4">Stage 3/8</CustomHeading>
        <CustomHeading variant="h2">Company address</CustomHeading>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <FormInput
          name={`company.companyAddress.fullAddress`}
          control={control}
          rules={{ required: 'Company address is required.' }}
          labelText="Full address"
        />
        <FormInput
          name={`company.companyAddress.thoroughfare`}
          control={control}
          labelText="Thoroughfare"
          optionalText="optional"
        />
        <FormInput
          name={`company.companyAddress.locatorDesignator`}
          control={control}
          rules={{
            validate: value => {
              if (!value) return true;
              if (value.length > 10) return 'Max 10 characters.';
            },
          }}
          labelText="Locator designator"
          optionalText="optional"
        />
        <FormInput
          name={`company.companyAddress.locatorName`}
          control={control}
          labelText="Locator name"
          optionalText="optional"
        />
        <FormInput
          name={`company.companyAddress.addressArea`}
          control={control}
          labelText="Address area"
          optionalText="optional"
        />
        <FormInput
          name={`company.companyAddress.postCode`}
          control={control}
          labelText="Post code"
          optionalText="optional"
        />
        <FormInput
          name={`company.companyAddress.postName`}
          control={control}
          labelText="Post name"
          optionalText="optional"
        />
        <FormInput
          name={`company.companyAddress.poBox`}
          control={control}
          labelText="Post box"
          optionalText="optional"
        />
        <FormInput
          name={`company.companyAddress.adminUnitLevel1`}
          control={control}
          labelText="Admin unit level 1"
          optionalText="optional"
        />
        <FormInput
          name={`company.companyAddress.adminUnitLevel2`}
          control={control}
          labelText="Admin unit level 2"
          optionalText="optional"
        />
      </div>
    </div>
  );
}
