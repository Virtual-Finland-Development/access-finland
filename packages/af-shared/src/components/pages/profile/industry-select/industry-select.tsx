import { useMemo } from 'react';
import { Label } from 'suomifi-ui-components';
import type { Nace } from '@/types';
import { findNace, getGroupedNaceCodes } from '@/lib/utils';
import { useModal } from '@/context/modal-context';
import IndustryEdit from './industry-edit';

interface Props {
  userNaceCode: string | undefined | null;
  naceCodes: Nace[];
  onSelect: (selected: Nace | undefined) => void;
}

export default function IndustrySelect(props: Props) {
  const { userNaceCode, onSelect, naceCodes } = props;

  const groupedNaceCodes = useMemo(
    () => getGroupedNaceCodes(naceCodes || []),
    [naceCodes]
  );

  const { openModal, closeModal } = useModal();

  const openNaceSelect = () =>
    openModal({
      title: 'Select your preferred industry',
      content: (
        <IndustryEdit
          items={groupedNaceCodes}
          defaultSelected={
            userNaceCode ? findNace(groupedNaceCodes, userNaceCode) : undefined
          }
          onSelect={selected => {
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
      <Label>Preferred industry to work in</Label>
      <div className="!text-base">
        {!userNaceCode && <span>No industry selected, </span>}
        <button
          type="button"
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600 text-left"
          onClick={openNaceSelect}
        >
          {!userNaceCode
            ? 'click here to add.'
            : findNace(naceCodes || [], userNaceCode)?.prefLabel.en ||
              'undefined industry'}
        </button>
      </div>
    </div>
  );
}
