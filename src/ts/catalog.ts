import { LOGIN_MODAL_OPEN_EVENT } from "./components/loginModal";
import {
  FILTER_KEYS,
  initializeFilterOptions,
  type FilterKey,
  updateFilterFieldState,
  updateSalesFieldState,
} from "./components/catalogFiltersUi";
import { createProductCardMarkup, truncateText } from "./components/productCards";
import {
  createPaginationMarkup,
  getPageItems,
  getProductsPerPage,
  updateResultsCounter,
} from "./components/catalogPagination";
import { hideCatalogPopup, showCatalogPopup } from "./components/catalogPopup";
import { createSetCardMarkup } from "./components/setCards";
import { applyCatalogState, filterItemsBySearch } from "./utils/catalogFilters";
import { isUserLoggedIn } from "./utils/auth";
import { addToCart } from "./utils/cart";
import { getProductData } from "./utils/productData";
import type { CatalogFilters, CatalogState, SortValue } from "./types/catalog";

function scrollToCatalogSection(element: HTMLElement): void {
  const header = document.querySelector<HTMLElement>(".header");
  const headerOffset = header ? header.offsetHeight : 0;
  const extraOffset = 16;
  const targetTop =
    window.scrollY +
    element.getBoundingClientRect().top -
    headerOffset -
    extraOffset;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: "smooth",
  });
}

function requestLoginModalOpen(): void {
  document.dispatchEvent(new CustomEvent(LOGIN_MODAL_OPEN_EVENT));
}

type CatalogElements = {
  productsList: HTMLElement;
  resultsCounter: HTMLElement;
  catalogTop: HTMLElement;
  pagination: HTMLElement;
};

function renderCatalogPage(
  state: CatalogState,
  elements: CatalogElements,
  shouldScroll = false,
): void {
  const productsPerPage = getProductsPerPage();
  const totalPages = Math.ceil(
    state.visibleProductItems.length / productsPerPage,
  );

  state.currentPage = Math.min(
    Math.max(state.currentPage, 1),
    Math.max(totalPages, 1),
  );

  const pagedItems = getPageItems(state.visibleProductItems, state.currentPage);

  elements.productsList.innerHTML = pagedItems
    .map(createProductCardMarkup)
    .join("");
  elements.pagination.innerHTML = createPaginationMarkup(
    state.visibleProductItems.length,
    state.currentPage,
  );
  updateResultsCounter(
    elements.resultsCounter,
    state.visibleProductItems.length,
    state.currentPage,
  );

  if (shouldScroll) {
    scrollToCatalogSection(elements.catalogTop);
  }
}

export async function initCatalogPage(): Promise<void> {
  const productsList = document.querySelector<HTMLElement>(
    "[data-catalog-products]",
  );
  const setsList = document.querySelector<HTMLElement>("[data-catalog-sets]");
  const resultsCounter = document.querySelector<HTMLElement>(
    "[data-catalog-results]",
  );
  const catalogTop = document.querySelector<HTMLElement>(".catalog__top");
  const pagination = document.querySelector<HTMLElement>(
    "[data-catalog-pagination]",
  );
  const sortSelect = document.querySelector<HTMLSelectElement>(
    "[data-catalog-sort]",
  );
  const searchForm = document.querySelector<HTMLFormElement>(
    "[data-catalog-search-form]",
  );
  const searchInput = document.querySelector<HTMLInputElement>(
    "[data-catalog-search]",
  );
  const searchClearButton = document.querySelector<HTMLButtonElement>(
    "[data-catalog-search-clear]",
  );
  const filtersToggleButton = document.querySelector<HTMLButtonElement>(
    "[data-catalog-filters-toggle]",
  );
  const filtersResetButton = document.querySelector<HTMLButtonElement>(
    "[data-catalog-filters-reset]",
  );
  const filtersPanel = document.querySelector<HTMLElement>(
    "[data-catalog-filters-panel]",
  );
  const filterFields = document.querySelectorAll<HTMLElement>("[data-filter-field]");
  const salesFilterInput = document.querySelector<HTMLInputElement>(
    "[data-filter-sales]",
  );
  const popup = document.querySelector<HTMLElement>("[data-catalog-popup]");
  const popupCloseControls = document.querySelectorAll<HTMLElement>(
    "[data-catalog-popup-close]",
  );

  if (
    !productsList ||
    !setsList ||
    !resultsCounter ||
    !catalogTop ||
    !pagination ||
    !sortSelect ||
    !searchForm ||
    !searchInput ||
    !searchClearButton ||
    !filtersToggleButton ||
    !filtersResetButton ||
    !filtersPanel ||
    !salesFilterInput ||
    !popup
  ) {
    return;
  }

  try {
    const items = await getProductData();
    const productItems = items;
    const setItems = items
      .filter((item) => item.category === "luggage sets")
      .sort((first, second) => second.popularity - first.popularity);
    const productItemsMap = new Map(
      productItems.map((item) => [item.id, item] as const),
    );

    const state: CatalogState = {
      allProductItems: productItems,
      visibleProductItems: productItems,
      currentPage: 1,
      currentSort: "default",
      currentSearchQuery: "",
      filters: {
        size: "",
        color: "",
        category: "",
        salesOnly: false,
      },
    };

    const updateSearchClearButton = (): void => {
      searchClearButton.hidden = searchInput.value.trim() === "";
    };

    const updateFiltersToggleButton = (): void => {
      const isExpanded = !filtersPanel.hidden;

      filtersToggleButton.textContent = isExpanded ? "Hide Filters" : "Show Filters";
      filtersToggleButton.setAttribute("aria-expanded", String(isExpanded));
    };

    const renderProductsPage = (shouldScroll = false): void => {
      renderCatalogPage(
        state,
        {
          productsList,
          resultsCounter,
          catalogTop,
          pagination,
        },
        shouldScroll,
      );
    };

    const updateVisibleItems = (shouldScroll = false): void => {
      state.visibleProductItems = applyCatalogState(state);
      state.currentPage = 1;
      renderProductsPage(shouldScroll);
    };

    initializeFilterOptions(productItems, state.filters);
    updateSalesFieldState(salesFilterInput);
    setsList.innerHTML = setItems
      .map((item) =>
        createSetCardMarkup({
          ...item,
          name: truncateText(item.name, 34),
        }),
      )
      .join("");
    renderProductsPage();
    updateSearchClearButton();
    updateFiltersToggleButton();

    sortSelect.addEventListener("change", () => {
      state.currentSort = sortSelect.value as SortValue;
      updateVisibleItems();
    });

    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nextQuery = searchInput.value.trim();

      if (!nextQuery) {
        hideCatalogPopup(popup);
        state.currentSearchQuery = "";
        updateVisibleItems();
        return;
      }

      const matchedItems = filterItemsBySearch(state.allProductItems, nextQuery);

      if (matchedItems.length === 0) {
        showCatalogPopup(popup);
        return;
      }

      state.currentSearchQuery = nextQuery;
      hideCatalogPopup(popup);
      updateVisibleItems();
    });

    searchInput.addEventListener("input", () => {
      updateSearchClearButton();

      if (searchInput.value.trim() === "" && state.currentSearchQuery !== "") {
        hideCatalogPopup(popup);
        state.currentSearchQuery = "";
        updateVisibleItems();
      }
    });

    searchClearButton.addEventListener("click", () => {
      searchInput.value = "";
      hideCatalogPopup(popup);
      state.currentSearchQuery = "";
      updateSearchClearButton();
      updateVisibleItems();
      searchInput.focus();
    });

    filtersToggleButton.addEventListener("click", () => {
      filtersPanel.hidden = !filtersPanel.hidden;
      updateFiltersToggleButton();
    });

    filtersResetButton.addEventListener("click", () => {
      const defaultFilters: CatalogFilters = {
        size: "",
        color: "",
        category: "",
        salesOnly: false,
      };

      state.filters = defaultFilters;
      salesFilterInput.checked = false;
      updateSalesFieldState(salesFilterInput);

      FILTER_KEYS.forEach((key) => {
        const field = document.querySelector<HTMLElement>(
          `[data-filter-field="${key}"]`,
        );

        if (field) {
          updateFilterFieldState(field, "");
        }
      });

      updateVisibleItems();
    });

    filterFields.forEach((field) => {
      const trigger = field.querySelector<HTMLButtonElement>("[data-filter-trigger]");

      trigger?.addEventListener("click", () => {
        const isOpen = field.classList.contains("catalog-filters__field--open");

        filterFields.forEach((otherField) => {
          const otherTrigger =
            otherField.querySelector<HTMLElement>("[data-filter-trigger]");

          otherField.classList.remove("catalog-filters__field--open");
          otherTrigger?.setAttribute("aria-expanded", "false");
        });

        field.classList.toggle("catalog-filters__field--open", !isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
      });
    });

    filtersPanel.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const optionButton = target.closest<HTMLButtonElement>("[data-filter-option]");

      if (!optionButton) {
        return;
      }

      const filterKey = optionButton.dataset.filterKey as FilterKey | undefined;
      const filterValue = optionButton.dataset.filterValue ?? "";
      const field = optionButton.closest<HTMLElement>("[data-filter-field]");

      if (!filterKey || !field) {
        return;
      }

      state.filters = {
        ...state.filters,
        [filterKey]: filterValue,
      };

      updateFilterFieldState(field, filterValue);
      updateVisibleItems();
    });

    salesFilterInput.addEventListener("change", () => {
      state.filters = {
        ...state.filters,
        salesOnly: salesFilterInput.checked,
      };
      updateSalesFieldState(salesFilterInput);
      updateVisibleItems();
    });

    pagination.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      if (target.dataset.page) {
        state.currentPage = Number(target.dataset.page);
        renderProductsPage(true);
        return;
      }

      if (target.dataset.pageNav === "prev") {
        state.currentPage -= 1;
        renderProductsPage(true);
        return;
      }

      if (target.dataset.pageNav === "next") {
        state.currentPage += 1;
        renderProductsPage(true);
      }
    });

    productsList.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const addToCartButton = target.closest<HTMLButtonElement>("[data-product-id]");

      if (!addToCartButton) {
        return;
      }

      const productId = addToCartButton.dataset.productId;

      if (!productId) {
        return;
      }

      if (!isUserLoggedIn()) {
        requestLoginModalOpen();
        return;
      }

      const product = productItemsMap.get(productId);

      if (!product) {
        return;
      }

      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        color: product.color,
        size: product.size,
      });
    });

    popupCloseControls.forEach((control) => {
      control.addEventListener("click", () => hideCatalogPopup(popup));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !popup.hidden) {
        hideCatalogPopup(popup);
      }

      if (event.key === "Escape") {
        filterFields.forEach((field) => {
          const trigger = field.querySelector<HTMLElement>("[data-filter-trigger]");

          field.classList.remove("catalog-filters__field--open");
          trigger?.setAttribute("aria-expanded", "false");
        });
      }
    });

    document.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest("[data-filter-dropdown]")) {
        return;
      }

      filterFields.forEach((field) => {
        const trigger = field.querySelector<HTMLElement>("[data-filter-trigger]");

        field.classList.remove("catalog-filters__field--open");
        trigger?.setAttribute("aria-expanded", "false");
      });
    });
  } catch (error) {
    console.error(error);
    productsList.innerHTML =
      '<li class="catalog__empty">Unable to load catalog items right now.</li>';
    setsList.innerHTML = "";
    pagination.innerHTML = "";
    updateResultsCounter(resultsCounter, 0, 1);
  }
}
