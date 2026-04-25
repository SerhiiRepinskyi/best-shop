import { LOGIN_MODAL_OPEN_EVENT } from "./components/loginModal";
import { isUserLoggedIn } from "./utils/auth";
import { addToCart } from "./utils/cart";

type CatalogItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  color: string;
  size: string;
  salesStatus: boolean;
  rating: number;
  popularity: number;
};

type CatalogResponse = {
  data: CatalogItem[];
};

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

const DATA_URL = "/assets/data.json";
const SETS_CATEGORY = "luggage sets";
const PRODUCTS_PER_PAGE = 12;

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).replace(/\s+$/, "")}...`;
}

function createRatingStars(rating: number): string {
  const filledStars = Math.round(rating);

  return Array.from(
    { length: 5 },
    (_, index) =>
      `<span class="catalog-set-card__star${
        index < filledStars ? " catalog-set-card__star--filled" : ""
      }">&#9733;</span>`,
  ).join("");
}

function createProductCardMarkup(item: CatalogItem): string {
  const productUrl = getProductDetailsUrl(item.id);

  return `
    <li class="catalog-card">
      <article class="catalog-card__article">
        <a
          class="catalog-card__media catalog-card__product-link"
          href="${productUrl}"
          aria-label="${item.name}"
        >
          ${
            item.salesStatus
              ? '<span class="catalog-card__badge">Sale</span>'
              : ""
          }
          <img
            class="catalog-card__image"
            src="${item.imageUrl}"
            alt="${item.name}"
            width="296"
            height="400"
            loading="lazy"
          />
        </a>

        <div class="catalog-card__content">
          <h3 class="catalog-card__title">
            <a class="catalog-card__title-link" href="${productUrl}">
              ${truncateText(item.name, 42)}
            </a>
          </h3>
          <p class="catalog-card__price">$${item.price}</p>
          <button
            class="btn catalog-card__button"
            type="button"
            data-product-id="${item.id}"
          >
            Add To Cart
          </button>
        </div>
      </article>
    </li>
  `;
}

function createSetCardMarkup(item: CatalogItem): string {
  return `
    <li class="catalog-set-card">
      <article class="catalog-set-card__article">
        <div class="catalog-set-card__media" aria-label="${item.name}">
          <img
            class="catalog-set-card__image"
            src="${item.imageUrl}"
            alt="${item.name}"
            width="87"
            height="87"
            loading="lazy"
          />
        </div>

        <div class="catalog-set-card__content">
          <h3 class="catalog-set-card__title">${truncateText(item.name, 34)}</h3>
          <div
            class="catalog-set-card__rating"
            aria-label="Rating ${item.rating} out of 5"
          >
            ${createRatingStars(item.rating)}
          </div>
          <p class="catalog-set-card__price">$${item.price}</p>
        </div>
      </article>
    </li>
  `;
}

async function getCatalogData(): Promise<CatalogItem[]> {
  const response = await fetch(DATA_URL);

  if (!response.ok) {
    throw new Error("Failed to load catalog data.");
  }

  const payload: CatalogResponse = await response.json();
  return payload.data;
}

function sortItems(items: CatalogItem[], sortValue: SortValue): CatalogItem[] {
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

function filterItemsBySearch(
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

function getPageItems(
  items: CatalogItem[],
  currentPage: number,
): CatalogItem[] {
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  return items.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
}

function updateResultsCounter(
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

function createPaginationMarkup(
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
        ${currentPage === totalPages ? "disabled" : ""}
      >
        Next
      </button>
    </div>
  `;
}

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

function showPopup(popup: HTMLElement): void {
  popup.hidden = false;
  document.body.classList.add("no-scroll");
}

function hidePopup(popup: HTMLElement): void {
  popup.hidden = true;
  document.body.classList.remove("no-scroll");
}

function applyState(state: CatalogState): CatalogItem[] {
  const filteredItems = filterItemsBySearch(
    state.allProductItems,
    state.currentSearchQuery,
  );

  return sortItems(filteredItems, state.currentSort);
}

function getProductDetailsUrl(productId: string): string {
  return `/html/product.html?id=${encodeURIComponent(productId)}`;
}

function requestLoginModalOpen(): void {
  document.dispatchEvent(new CustomEvent(LOGIN_MODAL_OPEN_EVENT));
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
    const items = await getCatalogData();
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
      const totalPages = Math.ceil(
        state.visibleProductItems.length / PRODUCTS_PER_PAGE,
      );

      state.currentPage = Math.min(
        Math.max(state.currentPage, 1),
        Math.max(totalPages, 1),
      );

      const pagedItems = getPageItems(
        state.visibleProductItems,
        state.currentPage,
      );

      productsList.innerHTML = pagedItems.map(createProductCardMarkup).join("");
      pagination.innerHTML = createPaginationMarkup(
        state.visibleProductItems.length,
        state.currentPage,
      );
      updateResultsCounter(
        resultsCounter,
        state.visibleProductItems.length,
        state.currentPage,
      );

      if (shouldScroll) {
        scrollToCatalogSection(catalogTop);
      }
    };

    const updateVisibleItems = (shouldScroll = false): void => {
      state.visibleProductItems = applyState(state);
      state.currentPage = 1;
      renderProductsPage(shouldScroll);
    };

    setsList.innerHTML = setItems.map(createSetCardMarkup).join("");
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
        hidePopup(popup);
        state.currentSearchQuery = "";
        updateVisibleItems();
        return;
      }

      const matchedItems = filterItemsBySearch(state.allProductItems, nextQuery);

      if (matchedItems.length === 0) {
        showPopup(popup);
        return;
      }

      state.currentSearchQuery = nextQuery;
      hidePopup(popup);
      updateVisibleItems();
    });

    searchInput.addEventListener("input", () => {
      updateSearchClearButton();

      if (searchInput.value.trim() === "" && state.currentSearchQuery !== "") {
        hidePopup(popup);
        state.currentSearchQuery = "";
        updateVisibleItems();
      }
    });

    searchClearButton.addEventListener("click", () => {
      searchInput.value = "";
      hidePopup(popup);
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
      control.addEventListener("click", () => hidePopup(popup));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !popup.hidden) {
        hidePopup(popup);
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
