import type { CatalogItem, CatalogState, SortValue } from "../types/catalog";

export function sortItems(
  items: CatalogItem[],
  sortValue: SortValue,
): CatalogItem[] {
  const nextItems = [...items];

  switch (sortValue) {
    case "price-asc":
      return nextItems.sort((first, second) => first.price - second.price);
    case "price-desc":
      return nextItems.sort((first, second) => second.price - first.price);
    case "popularity-desc":
      return nextItems.sort(
        (first, second) => second.popularity - first.popularity,
      );
    case "rating-desc":
      return nextItems.sort((first, second) => second.rating - first.rating);
    case "default":
    default:
      return nextItems;
  }
}

export function filterItemsBySearch(
  items: CatalogItem[],
  searchQuery: string,
): CatalogItem[] {
  if (!searchQuery) {
    return [...items];
  }

  const normalizedQuery = searchQuery.toLowerCase();

  return items.filter((item) =>
    item.name.toLowerCase().includes(normalizedQuery),
  );
}

export function applyCatalogState(state: CatalogState): CatalogItem[] {
  const filteredItems = filterItemsBySearch(
    state.allProductItems,
    state.currentSearchQuery,
  );

  return sortItems(filteredItems, state.currentSort);
}
