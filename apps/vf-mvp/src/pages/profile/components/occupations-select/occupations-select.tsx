import { useMemo } from 'react';
import { IoAdd } from 'react-icons/io5';
import { Label, Text, TextInput } from 'suomifi-ui-components';
import type { Occupation, UserOccupation } from '@shared/types';
import { useModal } from '@shared/context/modal-context';
import OccupationsEdit from './occupations-edit';

interface Props {
  userOccupations: UserOccupation[] | undefined;
  occupations: Occupation[];
  onSelect: (selected: UserOccupation[]) => void;
}

export default function OccupationsSelect(props: Props) {
  const { userOccupations, occupations, onSelect } = props;

  const { openModal, closeModal } = useModal();

  // add labels to user occupations
  const userOccupationsWithLables = useMemo(() => {
    if (!userOccupations?.length || !occupations) return [];

    return userOccupations.map(o => ({
      ...o,
      label:
        occupations.find(option => option.uri === o.escoIdentifier)?.prefLabel
          ?.en || '',
    }));
  }, [occupations, userOccupations]);

  const openEdit = () => {
    openModal({
      title: 'Occupations',
      content: (
        <OccupationsEdit
          userOccupations={userOccupationsWithLables}
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

  // left for reference, may be needed for ux
  /* return (
    <div className="relative">
      <TextInput
        labelText="Occupations"
        readOnly
        visualPlaceholder="No occupations selected, click to add"
        aria-placeholder="No occuaptions selected, click button to add."
        onClick={openEdit}
      />
      <IoAdd
        size="26"
        className="absolute top-[41px] right-0 text-suomifi-light"
        role="button"
        tabIndex={0}
        onClick={openEdit}
      />
    </div>
  ); */

  return (
    <div>
      <Label>Occupations</Label>
      {!userOccupations?.length ? (
        <Text className="!text-base">
          <span>No occupations selected, </span>
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
          {userOccupations.map((uo, index) => (
            <li key={`${uo.escoIdentifier}-${index}`}>
              <Text className="!text-base">
                <button
                  type="button"
                  className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                  onClick={openEdit}
                >
                  {occupations?.find(o => o.uri === uo.escoIdentifier)
                    ?.prefLabel.en || ''}
                </button>
              </Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
