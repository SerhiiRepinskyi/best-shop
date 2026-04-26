type SetCardItem = {
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
};

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

export function createSetCardMarkup(item: SetCardItem): string {
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
          <h3 class="catalog-set-card__title">${item.name}</h3>
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

export type { SetCardItem };
