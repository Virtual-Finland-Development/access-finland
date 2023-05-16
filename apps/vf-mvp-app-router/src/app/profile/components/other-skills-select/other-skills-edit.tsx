import { useCallback, useState } from 'react';
import { Button } from 'suomifi-ui-components';
import { JmfRecommendation, OtherSkill, SkillLevel } from '@/types';
import JmfRecommendationsSelect from '../jmf-recommendations/jmf-recommendations';
import OtherSkillsAdditionalInfo from './other-skills-additional-info';
import { UserOtherSkill } from './other-skills-select';

interface Props {
  userOtherSkillsWithLabels: UserOtherSkill[] | null;
  onSave: (selected: OtherSkill[]) => void;
  onClose: () => void;
}

export default function OtherSkillsEdit(props: Props) {
  const { userOtherSkillsWithLabels, onClose, onSave } = props;

  const [phase, setPhase] = useState<'selections' | 'additional-info'>(
    'selections'
  );
  const [selected, setSelected] = useState<UserOtherSkill[]>(
    userOtherSkillsWithLabels || []
  );

  const selectSkill = useCallback((skill: JmfRecommendation) => {
    setSelected(prev => {
      let selected = [...prev];
      const index = selected.findIndex(s => s.escoIdentifier === skill.uri);

      if (index > -1) {
        selected = selected.filter((_, i) => i !== index);
      } else {
        selected.push({
          escoIdentifier: skill.uri,
          skillLevel: SkillLevel['beginner'],
          label: skill.label,
        });
      }

      return selected;
    });
  }, []);

  const handleSave = () => {
    onSave(selected);
  };

  return (
    <>
      {phase === 'additional-info' && (
        <OtherSkillsAdditionalInfo
          selected={selected}
          onBack={() => setPhase('selections')}
          onSave={onSave}
        />
      )}

      <div className={phase === 'selections' ? 'block' : 'hidden'}>
        <JmfRecommendationsSelect
          type="skills"
          isControlled
          controlledSelected={selected.map(s => ({
            uri: s.escoIdentifier,
            label: s.label!,
          }))}
          onSelect={selectSkill}
          onSave={handleSave}
          onClose={onClose}
        />

        <div className="flex flecx-row items-start gap-3 mt-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            disabled={!selected.length}
            iconRight="arrowRight"
            onClick={() => setPhase('additional-info')}
          >
            ({selected?.length || 0}) Selected
          </Button>
        </div>
      </div>
    </>
  );
}
