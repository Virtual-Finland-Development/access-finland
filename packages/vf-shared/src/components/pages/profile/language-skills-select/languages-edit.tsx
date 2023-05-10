import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Button, Text } from 'suomifi-ui-components';
import type { EscoLanguage, LanguageSkill, LanguageSkillLevel } from '@/types';
import FormSingleSelect from '@/components/form/form-single-select';

interface Props {
  userLanguages: LanguageSkill[] | undefined;
  escoLanguages: EscoLanguage[];
  languageSkillLevels: LanguageSkillLevel[];
  onSave: (selected: LanguageSkill[]) => void;
  onClose: () => void;
}

interface FormProps {
  languages: LanguageSkill[];
}

const DEFAULT_VALUE: LanguageSkill = {
  escoIdentifier: '',
  languageCode: '',
  skillLevel: '',
};

export default function LanguagesEdit(props: Props) {
  const { userLanguages, escoLanguages, languageSkillLevels, onSave, onClose } =
    props;

  const { handleSubmit, control } = useForm<FormProps>({
    defaultValues: userLanguages
      ? { languages: userLanguages }
      : {
          languages: [DEFAULT_VALUE],
        },
  });

  const { fields, append, remove } = useFieldArray<FormProps>({
    control,
    name: 'languages',
  });

  const onSubmit: SubmitHandler<FormProps> = values => {
    const languages = values.languages.map(l => ({
      ...l,
      escoIdentifier:
        escoLanguages.find(
          lan => lan.twoLetterISOLanguageName === l.languageCode
        )?.escoUri || '',
    }));

    onSave(languages);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3">
        {!fields.length && <Text>No language skills selected.</Text>}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border-b border-gray-300 pb-4"
          >
            <FormSingleSelect
              name={`languages.${index}.languageCode`}
              control={control}
              rules={{ required: true }}
              labelText="Select language"
              items={escoLanguages.map(l => ({
                labelText: l.name,
                uniqueItemId: l.twoLetterISOLanguageName,
              }))}
            />
            <FormSingleSelect
              name={`languages.${index}.skillLevel`}
              control={control}
              rules={{ required: true }}
              labelText="Skill level"
              items={languageSkillLevels
                .filter(l => l.codeValue.length === 2)
                .map(l => ({
                  labelText: l.prefLabel.en,
                  uniqueItemId: l.codeValue,
                }))}
            />
            <div>
              <Button
                variant="link"
                iconRight="remove"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
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
