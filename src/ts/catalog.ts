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
      }">★</span>`,
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
          <button class="btn catalog-card__button" type="button" data-product-id="${item.id}">
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
          <div class="catalog-set-card__rating" aria-label="Rating ${item.rating} out of 5">
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

export async function initCatalogPage(): Promise<void> {
  const productsList = document.querySelector<HTMLElement>(
    "[data-catalog-products]",
  );
  const setsList = document.querySelector<HTMLElement>("[data-catalog-sets]");
  const resultsCounter = document.querySelector<HTMLElement>(
    "[data-catalog-results]",
  );

  if (!productsList || !setsList || !resultsCounter) {
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

    productsList.innerHTML = productItems.map(createProductCardMarkup).join("");
    setsList.innerHTML = setItems.map(createSetCardMarkup).join("");
    resultsCounter.textContent = `Showing 1-${productItems.length} Of ${productItems.length} Results`;
  } catch (error) {
    console.error(error);
    productsList.innerHTML =
      '<li class="catalog__empty">Unable to load catalog items right now.</li>';
    setsList.innerHTML = "";
    resultsCounter.textContent = "Showing 0-0 Of 0 Results";
  }
}
