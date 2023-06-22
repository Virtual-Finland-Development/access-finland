import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { Button, Text } from 'suomifi-ui-components';
import type { Certification, EscoSkill } from '@/types';
import FormInput from '@/components/form/form-input';
import MoreRecommendations from '../jmf-recommendations/more-recommendations';

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

  const { handleSubmit, control } = useForm<FormProps>({
    defaultValues: { certifications: userCertifications },
  });

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

        {fields.map((field, index) => (
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
              />
              <FormInput
                name={`certifications.${index}.institutionName`}
                control={control}
                rules={{ required: true }}
                labelText="Institution name"
              />
            </div>
            <Controller
              name={`certifications.${index}.escoIdentifier`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <MoreRecommendations
                  type="skills"
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
              iconRight="remove"
              className="!mt-3"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button
          variant="secondaryNoBorder"
          iconRight="plus"
          onClick={() => append(DEFAULT_VALUE)}
        >
          Add new
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
