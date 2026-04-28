import type { CatalogItem } from "../types/catalog";

const PRODUCTS_PER_PAGE = 12;

export function getProductsPerPage(): number {
  return PRODUCTS_PER_PAGE;
}

export function getPageItems(
  items: CatalogItem[],
  currentPage: number,
): CatalogItem[] {
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  return items.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
}

export function updateResultsCounter(
  element: HTMLElement,
  totalItems: number,
  currentPage: number,
): void {
  if (totalItems === 0) {
    element.textContent = "Showing 0-0 Of 0 Results";
    return;
  }

  const startItem = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * PRODUCTS_PER_PAGE, totalItems);
  element.textContent = `Showing ${startItem}-${endItem} Of ${totalItems} Results`;
}

export function createPaginationMarkup(
  totalItems: number,
  currentPage: number,
): string {
  const totalPages = Math.ceil(totalItems / PRODUCTS_PER_PAGE);

  if (totalPages <= 1) {
    return "";
  }

  const pageButtons = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    const isActive = page === currentPage;

    return `
      <button
        class="catalog__pagination-button${
          isActive ? " catalog__pagination-button--active" : ""
        }"
        type="button"
        data-page="${page}"
        ${isActive ? 'aria-current="page"' : ""}
      >
        ${page}
      </button>
    `;
  }).join("");

  return `
    <div class="catalog__pagination-inner">
      <button
        class="catalog__pagination-nav"
        type="button"
        data-page-nav="prev"
        ${currentPage === 1 ? "disabled" : ""}
      >
        Prev
      </button>

      <div class="catalog__pagination-pages">
        ${pageButtons}
      </div>

      <button
        class="catalog__pagination-nav"
        type="button"
        data-page-nav="next"
        ${currentPage === Math.ceil(totalItems / PRODUCTS_PER_PAGE) ? "disabled" : ""}
      >
        Next
      </button>
    </div>
  `;
}
