import { useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import lodash_get from 'lodash.get';
import { Button } from 'suomifi-ui-components';
import type { BoardMember } from '@shared/types';
import { BOARD_MEMBERS_ROLE_OPTIONS } from '@shared/lib/constants';
import { pickRandomDateString, pickRandomName } from '@shared/lib/utils';
import { useCompanyContext } from '@shared/context/company-context';
import FormInput from '@shared/components/form/form-input';
import FormSingleSelect from '@shared/components/form/form-single-select';
import CustomHeading from '@shared/components/ui/custom-heading';

interface FieldProps {
  company: {
    boardMembers: BoardMember[];
  };
}

const REQUIRED_FIELDS = [
  'role',
  'givenName',
  'middleNames',
  'lastName',
  'dateOfBirth',
  'nationality',
];

export default function CompanyBoardMembers() {
  const {
    values: { company },
    setIsCurrentStepDone,
    codesets: { countries },
  } = useCompanyContext();
  const { control, formState, getFieldState } = useFormContext<FieldProps>();
  const { invalid } = getFieldState('company.boardMembers', formState);
  const { fields, append, remove } = useFieldArray<FieldProps>({
    control,
    name: 'company.boardMembers',
  });

  const appendShareSeries = () => {
    append({
      role: 'chairperson' as const,
      givenName: pickRandomName('firstName'),
      lastName: pickRandomName('lastName'),
      middleNames: pickRandomName('firstName'),
      dateOfBirth: pickRandomDateString(),
      nationality: 'FIN',
    });
  };

  const removeShareSeries = (index: number) => {
    remove(index);
  };

  const isStepDone = useMemo(() => {
    const hasContextValues = (() => {
      const shareSeriesArr = lodash_get(company, 'boardMembers');

      if (Array.isArray(shareSeriesArr)) {
        return shareSeriesArr.every(i => {
          REQUIRED_FIELDS.every(field => i[field as keyof BoardMember]);
        });
      }

      return false;
    })();

    return hasContextValues ? !invalid : formState.isValid;
  }, [company, formState.isValid, invalid]);

  useEffect(() => {
    setIsCurrentStepDone('company.boardMembers', isStepDone);
  }, [isStepDone, setIsCurrentStepDone]);

  return (
    <div className="flex flex-col gap-4 items-start">
      <div>
        <CustomHeading variant="h4">Stage 6/8</CustomHeading>
        <CustomHeading variant="h2">Board members</CustomHeading>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col items-start gap-3 border-b border-b-gray-300 pb-6 w-full"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <FormSingleSelect
              name={`company.boardMembers.${index}.role`}
              control={control}
              rules={{ required: 'Role is required.' }}
              items={BOARD_MEMBERS_ROLE_OPTIONS}
              labelText="Role"
            />
            <FormInput
              name={`company.boardMembers.${index}.givenName`}
              control={control}
              rules={{ required: 'Given name is required.' }}
              labelText="Given name"
            />
            <FormInput
              name={`company.boardMembers.${index}.lastName`}
              control={control}
              rules={{ required: 'Last name is required.' }}
              labelText="Last name"
            />
            <FormInput
              name={`company.boardMembers.${index}.middleNames`}
              control={control}
              rules={{ required: 'Given name is required.' }}
              labelText="Middle names"
            />
            <FormInput
              type="date"
              name={`company.boardMembers.${index}.dateOfBirth`}
              control={control}
              rules={{ required: 'Date of birth is required.' }}
              labelText="Date of birth"
              hintText="Select from date picker"
            />
            <FormSingleSelect
              name={`company.boardMembers.${index}.nationality`}
              control={control}
              items={
                countries
                  ? countries.map(c => ({
                      labelText: c.englishName,
                      uniqueItemId: c.threeLetterISORegionName,
                    }))
                  : []
              }
              labelText="Nationality"
              hintText="Filter by typing or select from dropdown"
            />
          </div>
          {index > 0 && (
            <Button
              variant="link"
              iconRight="remove"
              onClick={() => removeShareSeries(index)}
            >
              Remove
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="secondaryNoBorder"
        iconRight="plus"
        onClick={appendShareSeries}
      >
        Add new
      </Button>
    </div>
  );
}
