import Highlighter from 'react-highlight-words';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { Disclosure } from '@headlessui/react';
import styled from 'styled-components';
import { Checkbox } from 'suomifi-ui-components';
import type { Nace } from '@/types';
import { isMatchWithSearch } from './helpers';

interface DisclosureLabelProps {
  item: Nace;
  isOpen: boolean;
  isTopLevel: boolean;
  isChecked: boolean;
  isIndeterminate: boolean;
  onSelect: (
    code: string,
    isChecked: boolean,
    isIndeterminate: boolean
  ) => void;
  searchText: string;
}

const Highlight = ({ children }: { children: string }) => (
  <strong>{children}</strong>
);

const StyledCheckbox = styled(Checkbox)<{ $isIndeterminate: boolean }>`
  ${({ $isIndeterminate }) =>
    $isIndeterminate &&
    `
svg {
  top: 8px !important;
  
}
svg path {
  d: path('M1 13a1 1 0 010-2h22a1 1 0 010 2H1z');
  stroke: hsl(212,63%,45%);
  stroke-width: 1.5px !important;
}
`}
`;

function DisclosureLabel(props: DisclosureLabelProps) {
  const {
    item,
    isOpen,
    isTopLevel,
    isChecked,
    isIndeterminate,
    onSelect,
    searchText,
  } = props;

  const searchWords = searchText.toLowerCase().split(' ');

  return isTopLevel ? (
    <Disclosure.Button className="flex flex-row gap-2 items-center justify-center text-left">
      <Highlighter
        searchWords={searchWords}
        autoEscape={true}
        textToHighlight={item.prefLabel.en}
        highlightTag={Highlight}
      />
      <span className="mt-1">
        {isOpen ? <IoChevronUp /> : <IoChevronDown />}
      </span>
    </Disclosure.Button>
  ) : (
    <div className="flex flex-row gap-2 items-center justify-items-center text-left">
      <StyledCheckbox
        className="!mr-2 text-start cursor-default"
        checked={isChecked}
        onClick={({ checkboxState }) =>
          onSelect(item.codeValue, checkboxState, isIndeterminate)
        }
        $isIndeterminate={isIndeterminate}
      >
        <Highlighter
          searchWords={searchWords}
          autoEscape={true}
          textToHighlight={item.prefLabel.en}
          highlightTag={Highlight}
        />
      </StyledCheckbox>

      {item.children && (
        <Disclosure.Button>
          <span className="mt-1 flex-shrink-0">
            {isOpen ? <IoChevronUp /> : <IoChevronDown />}
          </span>
        </Disclosure.Button>
      )}
    </div>
  );
}

interface IndustryDisclosureProps {
  item: Nace;
  selected: Nace | undefined;
  onSelect: (
    identifier: string,
    checked: boolean,
    isIndeterminate: boolean
  ) => void;
  searchText: string;
  isSearchMatch: boolean;
}

export default function IndustryDisclosure(props: IndustryDisclosureProps) {
  const { item, selected, onSelect, searchText, isSearchMatch } = props;

  const isChecked = Boolean(
    selected &&
      (selected.codeValue.startsWith(item.codeValue) ||
        selected.topLevelGroupCode === item.codeValue)
  );

  const isIndeterminate = Boolean(
    selected && isChecked && selected.codeValue !== item.codeValue
  );

  if (item.children) {
    return (
      <Disclosure defaultOpen={isChecked || isIndeterminate || isSearchMatch}>
        {({ open }) => (
          <>
            <DisclosureLabel
              isTopLevel={isNaN(parseInt(item.codeValue))}
              item={item}
              isOpen={open}
              isChecked={isChecked}
              isIndeterminate={isIndeterminate}
              onSelect={onSelect}
              searchText={searchText}
            />
            <Disclosure.Panel className="flex flex-col gap-3 mt-3">
              {open &&
                item.children
                  ?.filter(child =>
                    searchText ? isMatchWithSearch(child, searchText) : true
                  )
                  .map(item => (
                    <div
                      key={item.codeValue}
                      className="flex flex-col ml-4 items-start"
                    >
                      <IndustryDisclosure
                        item={item}
                        selected={selected}
                        onSelect={onSelect}
                        searchText={searchText}
                        isSearchMatch={isSearchMatch}
                      />
                    </div>
                  ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    );
  }

  return (
    <DisclosureLabel
      isTopLevel={false}
      item={item}
      isOpen
      isChecked={isChecked}
      isIndeterminate={isIndeterminate}
      onSelect={onSelect}
      searchText={searchText}
    />
  );
}
