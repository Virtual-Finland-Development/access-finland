import { Label } from 'suomifi-ui-components';
import type { Education, EducationField, EducationLevel } from '@/types';
import { useModal } from '@/context/modal-context';
import EducationsEdit from './educations-edit';

interface Props {
  userEducations: Education[] | undefined;
  educationFields: EducationField[];
  educationLevels: EducationLevel[];
  onSelect: (selected: Education[]) => void;
}

export default function EducationsSelect(props: Props) {
  const { userEducations, onSelect, educationFields, educationLevels } = props;

  const { openModal, closeModal } = useModal();

  const openEducationEdit = () =>
    openModal({
      title: 'Educations',
      content: (
        <EducationsEdit
          userEducations={userEducations}
          educationFields={educationFields}
          educationLevels={educationLevels}
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
      <Label>Educations</Label>
      {!userEducations?.length ? (
        <div className="!text-base">
          <span>No educations selected, </span>
          <button
            type="button"
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            onClick={openEducationEdit}
          >
            click here to add.
          </button>
        </div>
      ) : (
        <ul className="list-disc list-outside text-base ml-[17px]">
          {userEducations.map((e, index) => (
            <li key={`${e.educationField}-${index}`}>
              <button
                type="button"
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600 text-left"
                onClick={openEducationEdit}
              >
                {e.educationName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
