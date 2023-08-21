import type { Nace } from '@/types';

type ExtendedNace = Nace & { isSearchMatch?: boolean };

// search condition
function searchCondition(item: Nace, searchText: string) {
  const labelWords = item.prefLabel.en.toLowerCase().split(' ');
  const searchWords = searchText.toLowerCase().split(' ');

  return (
    searchWords.some(word => item.prefLabel.en.toLowerCase().includes(word)) ||
    labelWords.filter(word => searchWords.includes(word)).length > 0
  );
}

// try to find match with items & their children
export function isMatchWithSearch(item: Nace, searchText: string) {
  if (searchCondition(item, searchText)) {
    return true;
  }

  if (item.children) {
    for (const child of item.children) {
      if (isMatchWithSearch(child, searchText)) {
        return true;
      }
    }
  }

  return false;
}

// return matching items & their children by label search
export function searchItems(items: Nace[], searchText: string): ExtendedNace[] {
  return items.reduce((acc: ExtendedNace[], current: Nace) => {
    if (isMatchWithSearch(current, searchText))
      acc.push({ ...current, isSearchMatch: true });
    return acc;
  }, []);
}
