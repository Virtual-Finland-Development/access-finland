import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import lodash_get from 'lodash.get';
import { RouterLink } from 'suomifi-ui-components';
import type { CompanyDetails } from '@shared/types';
import { useCompanyContext } from '@shared/context/company-context';
import FormInput from '@shared/components/form/form-input';
import FormSingleSelect from '@shared/components/form/form-single-select';
import CustomHeading from '@shared/components/ui/custom-heading';

interface FieldProps {
  company: {
    companyDetails: CompanyDetails;
  };
}

const REQUIRED_FIELDS = [
  'name',
  'foundingDate',
  'industrySector',
  'shareCapital',
];

export default function CompanyDetails() {
  const {
    values: { company },
    setIsCurrentStepDone,
    codesets: { countries, currencies },
  } = useCompanyContext();
  const { control, formState, getFieldState } = useFormContext<FieldProps>();
  const { invalid } = getFieldState('company.companyDetails', formState);

  const isStepDone = useMemo(() => {
    const hasContextValues = REQUIRED_FIELDS.every(field =>
      lodash_get(company?.companyDetails, field)
    );
    return hasContextValues ? !invalid : formState.isValid;
  }, [company?.companyDetails, formState.isValid, invalid]);

  useEffect(() => {
    setIsCurrentStepDone('company.companyDetails', isStepDone);
  }, [isStepDone, setIsCurrentStepDone]);

  return (
    <div className="flex flex-col gap-4 items-start">
      <div>
        <CustomHeading variant="h4">Stage 2/8</CustomHeading>
        <CustomHeading variant="h2">Company details</CustomHeading>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <FormInput
          name={`company.companyDetails.name`}
          control={control}
          rules={{ required: 'Company name is required.' }}
          labelText="Company name"
        />
        <FormInput
          name={`company.companyDetails.alternativeName`}
          control={control}
          labelText="Alternative name"
          optionalText="optional"
        />
        <FormInput
          type="date"
          name={`company.companyDetails.foundingDate`}
          control={control}
          rules={{ required: 'Founding date is required.' }}
          labelText="Founding date"
          hintText="Select from date picker"
        />
        <div className="relative">
          <FormInput
            name={`company.companyDetails.industrySector`}
            control={control}
            rules={{ required: 'Industry sector is required.' }}
            labelText="Industry sector"
            hintText="Nace industry code"
          />
          <div className="absolute right-8 top-8">
            <RouterLink
              className="!text-base"
              href="https://koodistot.suomi.fi/codescheme;registryCode=dataecon;schemeCode=nace"
              target="_blank"
            >
              (list of nace codes)
            </RouterLink>
          </div>
        </div>
        <FormInput
          type="number"
          name={`company.companyDetails.shareCapital`}
          control={control}
          rules={{
            required: 'Share capital is required.',
            valueAsNumber: true,
            validate: value => value > -1,
          }}
          labelText="Share capital"
          hintText="Value of the issued shares of the company"
        />
        <FormSingleSelect
          name={`company.companyDetails.capitalCurrency`}
          control={control}
          rules={{ required: 'Capital currency is required.' }}
          labelText="Capital currency"
          hintText="Filter by typing or select from dropdown"
          items={
            currencies
              ? currencies.map(c => ({
                  labelText: `${c.id} (${c.name})`,
                  uniqueItemId: c.id,
                }))
              : []
          }
        />
        <FormInput
          type="number"
          name={`company.companyDetails.settlementDeposit`}
          control={control}
          rules={{ valueAsNumber: true, validate: value => value > -1 }}
          labelText="Settlement deposit"
          optionalText="optional"
          hintText="Deposit paid during the establishment"
        />
        <FormSingleSelect
          name={`company.companyDetails.depositCurrency`}
          control={control}
          labelText="Deposit currency"
          hintText="Filter by typing or select from dropdown"
          optionalText="optional"
          items={
            currencies
              ? currencies.map(c => ({
                  labelText: `${c.id} (${c.name})`,
                  uniqueItemId: c.id,
                }))
              : []
          }
        />
        <FormInput
          type="date"
          name={`company.companyDetails.settlementDate`}
          control={control}
          labelText="Settlement date"
          hintText="Select from date picker"
          optionalText="optional"
        />
        <FormSingleSelect
          name={`company.companyDetails.countryOfResidence`}
          control={control}
          labelText="Country of residence"
          hintText="Filter by typing or select from dropdown"
          optionalText="optional"
          items={
            countries
              ? countries.map(c => ({
                  labelText: c.englishName,
                  uniqueItemId: c.threeLetterISORegionName,
                }))
              : []
          }
        />
      </div>
    </div>
  );
}
