type ProductCardItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  salesStatus: boolean;
  color: string;
  size: string;
};

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).replace(/\s+$/, "")}...`;
}

export function getProductDetailsUrl(productId: string): string {
  return `/html/product.html?id=${encodeURIComponent(productId)}`;
}

export function createProductCardMarkup(item: ProductCardItem): string {
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

export type { ProductCardItem };
