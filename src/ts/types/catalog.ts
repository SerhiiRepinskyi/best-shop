import type { ProductDataItem } from "../utils/productData";

type CatalogItem = ProductDataItem;

type SortValue =
  | "default"
  | "price-asc"
  | "price-desc"
  | "popularity-desc"
  | "rating-desc";

type CatalogFilters = {
  size: string;
  color: string;
  category: string;
  salesOnly: boolean;
};

type CatalogState = {
  allProductItems: CatalogItem[];
  visibleProductItems: CatalogItem[];
  currentPage: number;
  currentSort: SortValue;
  currentSearchQuery: string;
  filters: CatalogFilters;
};

export type { CatalogItem, CatalogFilters, CatalogState, SortValue };
