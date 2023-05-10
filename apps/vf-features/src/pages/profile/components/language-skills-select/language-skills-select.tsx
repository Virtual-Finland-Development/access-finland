import { Label, Text } from 'suomifi-ui-components';
import type {
  EscoLanguage,
  LanguageSkill,
  LanguageSkillLevel,
} from '@shared/types';
import { useModal } from '@shared/context/modal-context';
import LanguagesEdit from './languages-edit';

interface Props {
  userLanguages: LanguageSkill[] | undefined;
  escoLanguages: EscoLanguage[];
  languageSkillLevels: LanguageSkillLevel[];
  onSelect: (selected: LanguageSkill[]) => void;
}

export default function LanguageSkillsSelect(props: Props) {
  const { userLanguages, onSelect, escoLanguages, languageSkillLevels } = props;

  const { openModal, closeModal } = useModal();

  const openLanguageEdit = () =>
    openModal({
      title: 'Select your language skills',
      content: (
        <LanguagesEdit
          userLanguages={userLanguages}
          escoLanguages={escoLanguages || []}
          languageSkillLevels={languageSkillLevels || []}
          onSave={selected => {
            onSelect(selected);
            closeModal();
          }}
          onClose={closeModal}
        />
      ),
      onClose: () => {},
    });

  return (
    <div>
      <Label>Language skills</Label>
      {!userLanguages?.length ? (
        <Text className="!text-base">
          <span>No languages selected, </span>
          <button
            type="button"
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            onClick={openLanguageEdit}
          >
            click here to add.
          </button>
        </Text>
      ) : (
        <ul className="list-disc list-outside text-base ml-[17px]">
          {userLanguages.map((l, index) => (
            <li key={`${l.escoIdentifier}-${index}`}>
              <Text className="!text-base">
                <button
                  type="button"
                  className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                  onClick={openLanguageEdit}
                >
                  {escoLanguages?.find(
                    el => el.twoLetterISOLanguageName === l.languageCode
                  )?.name || ''}{' '}
                  (
                  {
                    languageSkillLevels?.find(
                      sl => sl.codeValue === l.skillLevel
                    )?.prefLabel.en
                  }
                  )
                </button>
              </Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
