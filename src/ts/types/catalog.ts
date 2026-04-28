import type { ProductDataItem } from "../utils/productData";

type CatalogItem = ProductDataItem;

type SortValue =
  | "default"
  | "price-asc"
  | "price-desc"
  | "popularity-desc"
  | "rating-desc";

type CatalogState = {
  allProductItems: CatalogItem[];
  visibleProductItems: CatalogItem[];
  currentPage: number;
  currentSort: SortValue;
  currentSearchQuery: string;
};

export type { CatalogItem, CatalogState, SortValue };
