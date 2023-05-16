import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { yearsToMonths } from 'date-fns';
import { Button, Text } from 'suomifi-ui-components';
import type { UserOccupation } from '@/types';
import { useOccupations } from '@/lib/hooks/codesets';
import FormInput from '@/components/form/form-input';
import Loading from '@/components/ui/loading';
import type { UserOccupationSelection } from './occupations-edit';

interface Props {
  selected: UserOccupationSelection[];
  goBack: () => void;
  onSave: (selected: UserOccupation[]) => void;
}

interface FormProps {
  occupations: UserOccupationSelection[];
}

export default function OccupationsAdditionalInfo(props: Props) {
  const { selected, goBack, onSave } = props;

  const { data: occupations, isLoading } = useOccupations();

  const { handleSubmit, control } = useForm<FormProps>({
    defaultValues: {
      occupations: selected.map(s => ({
        ...s,
        workExperience: parseFloat((s.workExperience / 12).toFixed(1)),
      })),
    },
  });

  const { fields, remove } = useFieldArray<FormProps>({
    control,
    name: 'occupations',
  });

  const onSubmit: SubmitHandler<FormProps> = values => {
    onSave(
      values.occupations.map(selectedOccupation => ({
        escoIdentifier: selectedOccupation.escoIdentifier!,
        workExperience: yearsToMonths(
          parseFloat(selectedOccupation.workExperience!.toString())
        ),
        employer: selectedOccupation.employer!,
        escoCode:
          occupations?.find(o => o.uri === selectedOccupation.escoIdentifier)
            ?.notation || '',
      }))
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        {!fields.length && <Text>No occupations selected.</Text>}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-300 p-2 bg-suomifi-blue-bg-light"
          >
            <Text className="!italic">{field.label}</Text>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <FormInput
                name={`occupations.${index}.employer`}
                control={control}
                rules={{ required: 'Employer is required. ' }}
                labelText="Employer"
              />
              <FormInput
                type="number"
                name={`occupations.${index}.workExperience`}
                control={control}
                rules={{
                  required: 'Work experience is required.',
                  valueAsNumber: true,
                }}
                labelText="Work experience (years)"
                min={0}
                step={0.5}
              />
            </div>
            <div className="mt-3">
              <Button
                variant="secondary"
                iconRight="remove"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flecx-row items-start gap-3 mt-4">
        <Button variant="secondary" icon="arrowLeft" onClick={goBack}>
          Back
        </Button>
        <Button disabled={!selected.length} type="submit">
          Save
        </Button>
      </div>
    </form>
  );
}
