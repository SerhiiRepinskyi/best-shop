import { LOGIN_MODAL_OPEN_EVENT } from "./components/loginModal";
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
import type { CatalogItem, CatalogState, SortValue } from "./types/catalog";

const SETS_CATEGORY = "luggage sets";

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
    !popup
  ) {
    return;
  }

  try {
    const items = await getProductData();
    const productItems = items.filter(
      (item) => item.category !== SETS_CATEGORY,
    );
    const setItems = items
      .filter((item) => item.category === SETS_CATEGORY)
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
    };

    const updateSearchClearButton = (): void => {
      searchClearButton.hidden = searchInput.value.trim() === "";
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
