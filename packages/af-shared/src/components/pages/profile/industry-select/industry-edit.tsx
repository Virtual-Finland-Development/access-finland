import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import {
  Button,
  Expander,
  ExpanderContent,
  ExpanderGroup,
  ExpanderTitleButton,
  SearchInput,
  Text,
} from 'suomifi-ui-components';
import type { Nace } from '@/types';
import { findNace } from '@/lib/utils';
import CustomHeading from '@/components/ui/custom-heading';
import { isMatchWithSearch, searchItems } from './helpers';
import IndustryDisclosure from './industry-disclosure';

interface Props {
  items: Nace[] & { isSearchMatch?: boolean };
  defaultSelected: Nace | undefined;
  onSelect: (selected: Nace | undefined) => void;
  onClose: () => void;
}

export default function IndustryEdit(props: Props) {
  const { items, defaultSelected, onSelect, onClose } = props;
  const [selected, setSelected] = useState<Nace | undefined>(defaultSelected);
  const [openExpanders, setOpenExpanders] = useState<string[]>(
    defaultSelected?.topLevelGroupCode
      ? [defaultSelected.topLevelGroupCode]
      : []
  );
  const defaultOpenExpanderRef = useRef<null | HTMLDivElement>(null);
  const [searchText, setSearchText] = useState<string>('');

  // filter items by search
  const filteredItems = useMemo(() => {
    if (!searchText) return items;
    return searchItems(items, searchText);
  }, [items, searchText]);

  const handleSelect = useCallback(
    (identifier: string, isChecked: boolean, isIndeterminate: boolean) => {
      if (isChecked || isIndeterminate) {
        return setSelected(findNace(items, identifier));
      } else {
        return setSelected(undefined);
      }
    },
    [items]
  );

  // scroll into default opened expander, if defaultSelected is provided and if defaultOpenExpanderRef is defined
  useEffect(() => {
    if (defaultOpenExpanderRef.current) {
      if (typeof defaultOpenExpanderRef.current.scrollIntoView === 'function') {
        defaultOpenExpanderRef.current.scrollIntoView();
      }
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2 border p-2 bg-suomifi-blue-bg-light">
        <CustomHeading variant="h4">Industrial group </CustomHeading>

        <Text className="!text-base">
          Select your preferred industrial group. Choice of industrial group
          also includes all lower-level industrial groups.
        </Text>

        <SearchInput
          clearButtonLabel="Clear"
          labelText="Filter by searching"
          searchButtonLabel="Search"
          className="!w-full"
          onChange={text => {
            setOpenExpanders([]);
            setSearchText(typeof text === 'string' ? text : '');
          }}
        />

        <div className="py-2 border bg-white h-auto md:h-[300px] overflow-y-auto">
          <div className="mx-2">
            <ExpanderGroup
              closeAllText=""
              openAllText=""
              showToggleAllButton={false}
            >
              {!filteredItems.length && (
                <Text className="!text-base">No industry options found.</Text>
              )}

              {filteredItems.map(item => {
                const expanderIsOpen = openExpanders.includes(item.codeValue);

                return (
                  <Expander
                    key={item.codeValue}
                    open={expanderIsOpen}
                    onOpenChange={isOpen => {
                      if (isOpen) {
                        setOpenExpanders(prev =>
                          prev.filter(p => p !== item.codeValue)
                        );
                      } else {
                        setOpenExpanders(prev => [...prev, item.codeValue]);
                      }
                    }}
                    {...(defaultSelected?.topLevelGroupCode ===
                      item.codeValue && { ref: defaultOpenExpanderRef })}
                  >
                    <ExpanderTitleButton>
                      {item.prefLabel.en}
                    </ExpanderTitleButton>
                    <ExpanderContent>
                      <div className="flex flex-col gap-3">
                        {expanderIsOpen &&
                          item.children
                            ?.filter(child =>
                              searchText
                                ? isMatchWithSearch(child, searchText)
                                : true
                            )
                            .map(item => (
                              <div key={item.codeValue}>
                                <IndustryDisclosure
                                  key={item.codeValue}
                                  item={item}
                                  selected={selected}
                                  onSelect={handleSelect}
                                  searchText={searchText}
                                  isSearchMatch={
                                    searchText
                                      ? isMatchWithSearch(item, searchText)
                                      : false
                                  }
                                />
                              </div>
                            ))}
                      </div>
                    </ExpanderContent>
                  </Expander>
                );
              })}
            </ExpanderGroup>
          </div>
        </div>

        {selected && (
          <div className="flex items-start mt-2">
            <button
              className="flex flex-row items-center gap-2 bg-suomifi-light hover:bg-suomifi-light-hover text-white font-bold rounded-xl px-2"
              type="button"
              onClick={() => setSelected(undefined)}
              aria-label="Remove selected industry"
            >
              <span>{selected.prefLabel.en}</span>
              <IoClose
                className="flex-shrink-0"
                role="button"
                focusable={false}
                aria-hidden="true"
              />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-row gap-3 mt-4">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button onClick={() => onSelect(selected)}>Select</Button>
      </div>
    </>
  );
}
