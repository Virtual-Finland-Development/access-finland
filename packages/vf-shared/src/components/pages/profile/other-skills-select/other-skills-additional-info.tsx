import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Button, Text } from 'suomifi-ui-components';
import { OtherSkill, SkillLevel } from '@/types';
import { SKILL_LEVEL_LABELS } from '@/lib/constants';
import FormSingleSelect from '@/components/form/form-single-select';
import type { UserOtherSkill } from './other-skills-select';

interface Props {
  selected: UserOtherSkill[];
  onBack: () => void;
  onSave: (selected: OtherSkill[]) => void;
}

interface FormProps {
  otherSkills: UserOtherSkill[];
}

export default function OtherSkillsAdditionalInfo(props: Props) {
  const { selected, onBack, onSave } = props;

  const { handleSubmit, control } = useForm<FormProps>({
    defaultValues: {
      otherSkills: selected,
    },
  });

  const { fields, remove } = useFieldArray<FormProps>({
    control,
    name: 'otherSkills',
  });

  const onSubmit: SubmitHandler<FormProps> = values => {
    onSave(
      values.otherSkills.map(skill => ({
        escoIdentifier: skill.escoIdentifier,
        skillLevel: skill.skillLevel,
      }))
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        {!fields.length && <Text>No occupations selected.</Text>}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-300 p-2 bg-suomifi-blue-bg-light"
          >
            <Text className="!italic">
              {field.label || field.escoIdentifier}
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-2 items-end">
              <FormSingleSelect
                name={`otherSkills.${index}.skillLevel`}
                control={control}
                rules={{ required: true }}
                labelText="Skill level"
                items={Object.keys(SkillLevel).map(type => ({
                  labelText:
                    SKILL_LEVEL_LABELS[type as keyof typeof SKILL_LEVEL_LABELS],
                  uniqueItemId: type,
                }))}
              />
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
          </div>
        ))}
      </div>

      <div className="flex flecx-row items-start gap-3 mt-4">
        <Button variant="secondary" icon="arrowLeft" onClick={onBack}>
          Back
        </Button>
        <Button disabled={!selected.length} type="submit">
          Save
        </Button>
      </div>
    </form>
  );
}
