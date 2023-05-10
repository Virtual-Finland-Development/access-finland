import { useEffect, useMemo, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import lodash_debounce from 'lodash.debounce';
import { MultiSelect, Text } from 'suomifi-ui-components';
import useJmfRecommendations from '@shared/lib/hooks/use-jmf-recommendations';

interface SelectionItem {
  labelText: string;
  uniqueItemId: string;
}
interface Props {
  type: 'occupations' | 'skills';
  onSelect: (selected: any) => void;
  defaultValue: SelectionItem[];
  showCustomChipList?: boolean;
}

const CustomChipItem = ({
  item,
  onRemove,
}: {
  item: SelectionItem;
  onRemove: (item: SelectionItem) => void;
}) => {
  return (
    <button
      type="button"
      onClick={() => onRemove(item)}
      className="flex flex-row items-center gap-2 bg-suomifi-light hover:bg-suomifi-light-hover text-white font-bold text-base rounded-xl px-2"
    >
      <span>{item.labelText}</span>
      <IoClose
        className="flex-shrink-0"
        role="button"
        tabIndex={0}
        aria-label="Remove selected skill"
      />
    </button>
  );
};

export default function MoreRecommendations(props: Props) {
  const { type, onSelect, defaultValue, showCustomChipList = true } = props;
  const [inputValue, setInputValue] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] =
    useState<{ labelText: string; uniqueItemId: string }[]>(defaultValue);

  const {
    data: recommendations,
    isFetching: recommendationsFetching,
    refetch: fetchRecommendations,
  } = useJmfRecommendations(inputValue, {
    maxNumberOfSkills: type === 'skills' ? 100 : 1,
    maxNumberOfOccupations: type === 'occupations' ? 100 : 1,
  });

  const loadDebounced = useMemo(
    () => lodash_debounce(fetchRecommendations, 700),
    [fetchRecommendations]
  );

  useEffect(() => {
    if (inputValue) {
      setIsLoading(true);
      loadDebounced();
    } else {
      setIsLoading(false);
      loadDebounced.cancel();
    }
  }, [loadDebounced, inputValue]);

  useEffect(() => {
    if (!recommendationsFetching) {
      setIsLoading(false);
    }
  }, [recommendationsFetching]);

  const options: { labelText: string; uniqueItemId: string }[] = useMemo(() => {
    if (type === 'skills' && recommendations?.skills) {
      return recommendations.skills.map(skill => ({
        labelText: skill.label,
        uniqueItemId: skill.uri,
      }));
    } else if (type === 'occupations' && recommendations?.occupations) {
      return recommendations.occupations.map(occupation => ({
        labelText: occupation.label,
        uniqueItemId: occupation.uri,
      }));
    } else {
      return [];
    }
  }, [recommendations?.occupations, recommendations?.skills, type]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/*
          // @ts-ignore */}
      <MultiSelect
        className="!w-full"
        labelText="Select related skills"
        optionalText="Optional"
        visualPlaceholder="Type to search"
        itemAdditionHelpText=""
        ariaOptionsAvailableText="options available"
        ariaSelectedAmountText="option selected"
        ariaChipActionLabel="Remove"
        ariaOptionChipRemovedText="removed"
        noItemsText="No options found" // <-- need to use ts-ignore above, because this prop is wrongly typed...
        loading={isLoading}
        loadingText="Searching..."
        items={options}
        onChange={val => setInputValue(val)}
        onItemSelectionsChange={selected => {
          onSelect(selected);
          setSelected(selected);
        }}
        selectedItems={selected}
        chipListVisible={!showCustomChipList}
      />

      {showCustomChipList && (
        <div className="min-h-[70px] max-h-[70px] overflow-y-auto p-2">
          {!selected.length && (
            <Text className="!text-base">No related skills selected.</Text>
          )}

          {selected.length > 0 && (
            <div className="flex items-start justify-start flex-wrap gap-2">
              {selected.map(item => (
                <CustomChipItem
                  key={item.uniqueItemId}
                  item={item}
                  onRemove={item => {
                    setSelected(prev =>
                      prev.filter(i => i.uniqueItemId !== item.uniqueItemId)
                    );
                    onSelect(
                      selected.filter(i => i.uniqueItemId !== item.uniqueItemId)
                    );
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
