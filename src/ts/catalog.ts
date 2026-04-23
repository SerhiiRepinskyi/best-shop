type CatalogItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  salesStatus: boolean;
  rating: number;
  popularity: number;
};

type CatalogResponse = {
  data: CatalogItem[];
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
  return `
    <li class="catalog-card">
      <article class="catalog-card__article">
        <div class="catalog-card__media" aria-label="${item.name}">
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
        </div>

        <div class="catalog-card__content">
          <h3 class="catalog-card__title">${truncateText(item.name, 42)}</h3>
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

  if (
    !productsList ||
    !setsList ||
    !resultsCounter ||
    !catalogTop ||
    !pagination
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
    let currentPage = 1;

    const renderProductsPage = (page: number, shouldScroll = false): void => {
      const totalPages = Math.ceil(productItems.length / PRODUCTS_PER_PAGE);
      const nextPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));

      if (nextPage === currentPage && shouldScroll) {
        scrollToCatalogSection(catalogTop);
        return;
      }

      currentPage = nextPage;

      const pagedItems = getPageItems(productItems, currentPage);
      productsList.innerHTML = pagedItems.map(createProductCardMarkup).join("");
      pagination.innerHTML = createPaginationMarkup(
        productItems.length,
        currentPage,
      );
      updateResultsCounter(resultsCounter, productItems.length, currentPage);

      if (shouldScroll) {
        scrollToCatalogSection(catalogTop);
      }
    };

    setsList.innerHTML = setItems.map(createSetCardMarkup).join("");
    renderProductsPage(currentPage);

    pagination.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      if (target.dataset.page) {
        renderProductsPage(Number(target.dataset.page), true);
        return;
      }

      if (target.dataset.pageNav === "prev") {
        renderProductsPage(currentPage - 1, true);
        return;
      }

      if (target.dataset.pageNav === "next") {
        renderProductsPage(currentPage + 1, true);
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
