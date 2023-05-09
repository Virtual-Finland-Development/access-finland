import { useMemo } from 'react';
import { Label, Text } from 'suomifi-ui-components';
import type { EscoSkill, OtherSkill } from '@shared/types';
import { SKILL_LEVEL_LABELS } from '@shared/lib/constants';
import { useModal } from '@shared/context/modal-context';
import OtherSkillsEdit from './other-skills-edit';

export interface UserOtherSkill extends OtherSkill {
  label?: string;
}

interface Props {
  userOtherSkills: OtherSkill[] | undefined;
  escoSkills: EscoSkill[];
  onSelect: (selected: OtherSkill[]) => void;
}

export default function OtherSkillsSelect(props: Props) {
  const { userOtherSkills, onSelect, escoSkills } = props;
  const { openModal, closeModal } = useModal();

  const userOtherSkillsWithLabels = useMemo(() => {
    if (userOtherSkills?.length && escoSkills?.length) {
      const skills: UserOtherSkill[] = [];

      for (const s of userOtherSkills) {
        const escoIndex = escoSkills.findIndex(
          skill => skill.uri === s.escoIdentifier
        );
        skills.push({
          ...s,
          label:
            escoIndex > -1
              ? escoSkills[escoIndex].prefLabel.en
              : s.escoIdentifier,
        });
      }
      return skills;
    }
    return [];
  }, [escoSkills, userOtherSkills]);

  const openEdit = () => {
    openModal({
      title: 'Other skills',
      content: (
        <OtherSkillsEdit
          userOtherSkillsWithLabels={userOtherSkillsWithLabels}
          onSave={selected => {
            onSelect(selected);
            closeModal();
          }}
          onClose={() => closeModal()}
        />
      ),
      onClose: () => {},
    });
  };

  return (
    <div>
      <Label>Other skills</Label>
      {!userOtherSkills?.length ? (
        <Text className="!text-base">
          <span>No skills selected, </span>
          <button
            type="button"
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            onClick={openEdit}
          >
            click here to add.
          </button>
        </Text>
      ) : (
        <ul className="list-disc list-outside text-base ml-[17px]">
          {userOtherSkillsWithLabels.map((s, index) => (
            <li key={`${s.escoIdentifier}-${index}`}>
              <Text className="!text-base">
                <button
                  type="button"
                  className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                  onClick={openEdit}
                >
                  {s.label} ({SKILL_LEVEL_LABELS[s.skillLevel]})
                </button>
              </Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
