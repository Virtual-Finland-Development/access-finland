import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Button, IconPlus, IconRemove, Text } from 'suomifi-ui-components';
import type { Education, EducationField, EducationLevel } from '@/types';
import FormInput from '@/components/form/form-input';
import FormSingleSelect from '@/components/form/form-single-select';

interface Props {
  userEducations: Education[] | undefined;
  educationFields: EducationField[];
  educationLevels: EducationLevel[];
  onSave: (selected: Education[]) => void;
  onClose: () => void;
}

interface FormProps {
  educations: Education[];
}

const DEFAULT_VALUE: Education = {
  educationField: '',
  educationLevel: '',
  educationName: '',
  graduationDate: '',
  institutionName: '',
};

export default function EducationsEdit(props: Props) {
  const { userEducations, educationFields, educationLevels, onSave, onClose } =
    props;

  const { handleSubmit, control, watch } = useForm<FormProps>({
    defaultValues: userEducations
      ? { educations: userEducations }
      : {
          educations: [DEFAULT_VALUE],
        },
  });

  const educations = watch('educations');

  const { fields, append, remove } = useFieldArray<FormProps>({
    control,
    name: 'educations',
  });

  const onSubmit: SubmitHandler<FormProps> = values => {
    onSave(values.educations);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        {!fields.length && <Text>No educations added.</Text>}

        {fields.map((field, index) => {
          const educationName = educations[index]?.educationName;

          return (
            <div key={field.id} className="border-b border-gray-300 pb-4">
              <div className="grid sm:grid-cols-2 gap-3 items-end">
                <FormInput
                  name={`educations.${index}.educationName`}
                  control={control}
                  rules={{ required: true }}
                  labelText="Education name"
                  // have the input autofocus, when new field is added
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={index === fields.length - 1}
                />
                <FormInput
                  name={`educations.${index}.institutionName`}
                  control={control}
                  rules={{ required: true }}
                  labelText={
                    <>
                      Institution name{' '}
                      {educationName && (
                        <span className="sr-only">
                          for {educationName} education
                        </span>
                      )}
                    </>
                  }
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3 items-end mt-3">
                <FormSingleSelect
                  name={`educations.${index}.educationField`}
                  control={control}
                  rules={{ required: true }}
                  labelText={
                    <>
                      Education field{' '}
                      {educationName && (
                        <span className="sr-only">
                          for {educationName} education
                        </span>
                      )}
                    </>
                  }
                  items={educationFields.map(f => ({
                    labelText: f.prefLabel.fi,
                    uniqueItemId: f.codeValue,
                  }))}
                />
                <FormSingleSelect
                  name={`educations.${index}.educationLevel`}
                  control={control}
                  rules={{ required: true }}
                  labelText={
                    <>
                      Skill level{' '}
                      {educationName && (
                        <span className="sr-only">
                          for {educationName} education
                        </span>
                      )}
                    </>
                  }
                  items={educationLevels.map(l => ({
                    labelText: l.prefLabel.en,
                    uniqueItemId: l.codeValue,
                  }))}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3 items-end mt-3">
                <FormInput
                  type="date"
                  name={`educations.${index}.graduationDate`}
                  control={control}
                  rules={{ required: true }}
                  labelText={
                    <>
                      Graduation date{' '}
                      {educationName && (
                        <span className="sr-only">
                          for {educationName} education
                        </span>
                      )}
                    </>
                  }
                />
                <div>
                  <Button
                    variant="link"
                    iconRight={<IconRemove />}
                    onClick={() => remove(index)}
                  >
                    Remove{' '}
                    <span className="sr-only">
                      {educationName || ''} education
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <Button
          variant="secondaryNoBorder"
          iconRight={<IconPlus />}
          onClick={() => append(DEFAULT_VALUE)}
        >
          Add new <span className="sr-only">education</span>
        </Button>
      </div>
      <div className="flex flex-row gap-3 mt-8">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
