import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { Button, IconPlus, IconRemove, Text } from 'suomifi-ui-components';
import type { Certification, EscoSkill } from '@/types';
import FormInput from '@/components/form/form-input';
import MoreRecommendations from '@/components/pages/profile/jmf-recommendations/more-recommendations';

interface Props {
  userCertifications: Certification[];
  escoSkills: EscoSkill[];
  onSave: (selected: Certification[]) => void;
  onClose: () => void;
}

interface FormProps {
  certifications: Certification[];
}

const DEFAULT_VALUE: Certification = {
  escoIdentifier: [],
  certificationName: '',
  institutionName: '',
};

export default function CertificationsEdit(props: Props) {
  const { userCertifications, escoSkills, onSave, onClose } = props;

  const { handleSubmit, control, watch } = useForm<FormProps>({
    defaultValues: { certifications: userCertifications },
  });

  const certifications = watch('certifications');

  const { fields, append, remove } = useFieldArray<FormProps>({
    control,
    name: 'certifications',
  });

  const onSubmit: SubmitHandler<FormProps> = values => {
    onSave(values.certifications);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3">
        {!fields.length && <Text>No certifications added.</Text>}

        {fields.map((field, index) => {
          const certificationName = certifications[index]?.certificationName;

          return (
            <div
              key={field.id}
              className="flex flex-col gap-3 items-start border-b border-gray-300 pb-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <FormInput
                  name={`certifications.${index}.certificationName`}
                  control={control}
                  rules={{ required: true }}
                  labelText="Certification name"
                  // have the input autofocus, when new field is added
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={index === fields.length - 1}
                />
                <FormInput
                  name={`certifications.${index}.institutionName`}
                  control={control}
                  rules={{ required: true }}
                  labelText={
                    <>
                      Institution name{' '}
                      {certificationName && (
                        <span className="sr-only">
                          for {certificationName} certification
                        </span>
                      )}
                    </>
                  }
                />
              </div>
              <Controller
                name={`certifications.${index}.escoIdentifier`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <MoreRecommendations
                    type="skills"
                    labelText={
                      <>
                        Select related skills{' '}
                        {certificationName && (
                          <span className="sr-only">
                            for {certificationName}
                          </span>
                        )}
                      </>
                    }
                    onSelect={(
                      selected: {
                        labelText: string;
                        uniqueItemId: string;
                      }[]
                    ) => onChange(selected.map(s => s.uniqueItemId))}
                    defaultValue={value.map(escoIdentifier => {
                      const escoIndex = escoSkills.findIndex(
                        skill => skill.uri === escoIdentifier
                      );
                      return {
                        labelText:
                          escoIndex > -1
                            ? escoSkills[escoIndex].prefLabel.en
                            : escoIdentifier,
                        uniqueItemId: escoIdentifier,
                      };
                    })}
                  />
                )}
              />

              <Button
                variant="link"
                iconRight={<IconRemove />}
                className="!mt-3"
                onClick={() => remove(index)}
              >
                Remove{' '}
                <span className="sr-only">
                  {certificationName || 'certification'}
                </span>
              </Button>
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
          Add new <span className="sr-only">certification</span>
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
