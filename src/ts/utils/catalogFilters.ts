import type {
  CatalogFilters,
  CatalogItem,
  CatalogState,
  SortValue,
} from "../types/catalog";

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

export function filterItemsByCatalogFilters(
  items: CatalogItem[],
  filters: CatalogFilters,
): CatalogItem[] {
  return items.filter((item) => {
    if (filters.size && item.size !== filters.size) {
      return false;
    }

    if (filters.color && item.color !== filters.color) {
      return false;
    }

    if (filters.category && item.category !== filters.category) {
      return false;
    }

    if (filters.salesOnly && !item.salesStatus) {
      return false;
    }

    return true;
  });
}

export function applyCatalogState(state: CatalogState): CatalogItem[] {
  const searchedItems = filterItemsBySearch(
    state.allProductItems,
    state.currentSearchQuery,
  );
  const filteredItems = filterItemsByCatalogFilters(
    searchedItems,
    state.filters,
  );

  return sortItems(filteredItems, state.currentSort);
}
