import type { ProductDataItem } from "../utils/productData";

const SIZE_OPTIONS = ["S", "M", "L", "XL"];
const COLOR_OPTIONS = ["red", "blue", "green", "black", "grey", "yellow", "pink"];

const DESCRIPTION_VARIANTS = [
  [
    "The Voyager-crafted shell blends lightweight confidence with durable structure, making each departure feel smoother and more organized from the very first step.",
    "Thoughtful compartments, quiet-rolling wheels, and a streamlined silhouette help keep essentials secure while giving every journey a polished, dependable rhythm.",
  ],
  [
    "Built for modern getaways, this suitcase balances a resilient exterior with a refined interior layout that keeps travel basics neat and easy to access.",
    "Its smooth spinner movement, comfortable handle, and practical storage design create a calm, efficient packing experience for every destination ahead.",
  ],
  [
    "Designed to support frequent travelers, this piece combines impact-ready construction with lightweight mobility for a smarter and more comfortable ride.",
    "Inside, organized sections and secure straps simplify packing, while the clean profile and stable wheels bring confidence to every terminal and transfer.",
  ],
  [
    "This travel companion delivers an easy balance of style, strength, and spacious organization, making short escapes and longer plans feel equally effortless.",
    "From its reliable shell to its intuitive interior, each detail is shaped to keep belongings protected and movement through busy spaces refreshingly smooth.",
  ],
];

function formatPrice(value: number): string {
  return `$${value}`;
}

function createRatingStars(rating: number): string {
  const filledStars = Math.floor(rating);

  return Array.from({ length: 5 }, (_, index) => {
    const isFilled = index < filledStars;

    return `
      <span class="product-details__star${
        isFilled ? " product-details__star--filled" : ""
      }" aria-hidden="true">
        &#9733;
      </span>
    `;
  }).join("");
}

function getDescriptionParagraphs(productId: string): string[] {
  const hash = productId
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return DESCRIPTION_VARIANTS[hash % DESCRIPTION_VARIANTS.length];
}

function createSelectedOptionsMarkup(options: string[], selectedValue: string): string {
  return options
    .map((option) => {
      const isSelected = option === selectedValue ? " selected" : "";

      return `<option value="${option}"${isSelected}>${option}</option>`;
    })
    .join("");
}

function createSingleOptionMarkup(value: string): string {
  return `<option value="${value}" selected>${value}</option>`;
}

export function createProductDetailsMarkup(
  product: ProductDataItem,
): string {
  const [firstParagraph, secondParagraph] = getDescriptionParagraphs(product.id);
  const sizeOptions = createSelectedOptionsMarkup(SIZE_OPTIONS, product.size);
  const colorOptions = createSelectedOptionsMarkup(COLOR_OPTIONS, product.color);
  const categoryOptions = createSingleOptionMarkup(product.category);

  return `
    <article class="product-details__content">
      <div class="product-details__media">
        <img
          class="product-details__image"
          src="${product.imageUrl}"
          alt="${product.name}"
          width="645"
          height="860"
        />
      </div>

      <div class="product-details__info">
        <header class="product-details__header">
          <h1 class="product-details__title">${product.name}</h1>
          <div class="product-details__meta">
            <div
              class="product-details__rating"
              aria-label="Rating ${product.rating} out of 5"
            >
              ${createRatingStars(product.rating)}
            </div>
            <span class="product-details__reviews">(0 Clients Review)</span>
          </div>
          <p class="product-details__price">${formatPrice(product.price)}</p>
        </header>

        <div class="product-details__description">
          <p>${firstParagraph}</p>
          <p>${secondParagraph}</p>
        </div>

        <div class="product-details__selectors">
          <div class="product-details__field">
            <label class="product-details__label" for="product-size">Size</label>
            <select
              class="product-details__select"
              id="product-size"
              name="size"
              data-product-size
            >
              ${sizeOptions}
            </select>
          </div>

          <div class="product-details__field">
            <label class="product-details__label" for="product-color">Color</label>
            <select
              class="product-details__select"
              id="product-color"
              name="color"
              data-product-color
            >
              ${colorOptions}
            </select>
          </div>

          <div class="product-details__field">
            <label class="product-details__label" for="product-category">Category</label>
            <select
              class="product-details__select"
              id="product-category"
              name="category"
              data-product-category
            >
              ${categoryOptions}
            </select>
          </div>
        </div>

        <div class="product-details__actions">
          <div class="product-details__quantity" aria-label="Quantity selector">
            <button
              class="product-details__quantity-btn"
              type="button"
              aria-label="Decrease quantity"
              data-product-quantity="decrease"
            >
              -
            </button>
            <span class="product-details__quantity-value" data-product-quantity-value>
              1
            </span>
            <button
              class="product-details__quantity-btn"
              type="button"
              aria-label="Increase quantity"
              data-product-quantity="increase"
            >
              +
            </button>
          </div>

          <button
            class="btn btn--lg product-details__button"
            type="button"
            data-product-add-to-cart
          >
            Add To Cart
          </button>
        </div>

        <div class="product-details__payments" aria-label="Payment methods">
          <span class="product-details__payments-label">Payment:</span>
          <div class="product-details__payments-list">
            <img
              class="product-details__payment-icon"
              src="/assets/icons/product-card/visa-pay-logo.svg"
              alt="Visa"
              width="47"
              height="16"
            />
            <img
              class="product-details__payment-icon"
              src="/assets/icons/product-card/american-express-logo.svg"
              alt="American Express"
              width="60"
              height="21"
            />
            <img
              class="product-details__payment-icon"
              src="/assets/icons/product-card/master-card-logo.svg"
              alt="Mastercard"
              width="33"
              height="28"
            />
            <img
              class="product-details__payment-icon"
              src="/assets/icons/product-card/paypal-logo.svg"
              alt="PayPal"
              width="60"
              height="17"
            />
          </div>
        </div>
      </div>
    </article>
  `;
}

export function createProductDetailsFallbackMarkup(message: string): string {
  return `
    <div class="product-details__state">
      <p class="product-details__state-text">${message}</p>
      <a href="/html/catalog.html" class="btn btn--lg product-details__state-btn">
        Go To Catalog
      </a>
    </div>
  `;
}
