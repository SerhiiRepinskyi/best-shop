import type { CartDisplayItem, CartSummary } from "../utils/cartSummary";

function formatPrice(value: number): string {
  const normalizedValue = Number.isInteger(value) ? value : value.toFixed(2);
  return `$${normalizedValue}`;
}

export function createCartItemMarkup(item: CartDisplayItem): string {
  return `
    <li class="cart-page__row">
      <div class="cart-page__cell cart-page__cell--image">
        <img
          class="cart-page__image"
          src="${item.imageUrl}"
          alt="${item.name}"
          width="87"
          height="87"
        />
      </div>

      <div class="cart-page__cell cart-page__cell--name">
        <h2 class="cart-page__product-name">${item.name}</h2>
      </div>

      <div class="cart-page__cell cart-page__cell--price">
        <span class="cart-page__price">${formatPrice(item.unitPrice)}</span>
      </div>

      <div class="cart-page__cell cart-page__cell--quantity">
        <div class="cart-page__quantity-control" aria-label="Quantity selector">
          <button
            class="cart-page__quantity-btn"
            type="button"
            aria-label="Decrease quantity"
            data-cart-action="decrease"
            data-product-name="${item.name}"
            data-product-color="${item.color}"
            data-product-size="${item.size}"
          >
            -
          </button>
          <span class="cart-page__quantity-value">${item.quantity}</span>
          <button
            class="cart-page__quantity-btn"
            type="button"
            aria-label="Increase quantity"
            data-cart-action="increase"
            data-product-name="${item.name}"
            data-product-color="${item.color}"
            data-product-size="${item.size}"
          >
            +
          </button>
        </div>
      </div>

      <div class="cart-page__cell cart-page__cell--total">
        <span class="cart-page__line-total">${formatPrice(item.lineTotal)}</span>
      </div>

      <div class="cart-page__cell cart-page__cell--delete">
        <button
          class="cart-page__delete-btn"
          type="button"
          aria-label="Remove item"
          data-cart-action="remove"
          data-product-name="${item.name}"
          data-product-color="${item.color}"
          data-product-size="${item.size}"
        >
          <svg
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1 5H19"
              stroke="#B92770"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M17 5V19C17 19.5304 16.7893 20.0391 16.4142 20.4142C16.0391 20.7893 15.5304 21 15 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5M6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5"
              stroke="#B92770"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8 10V16"
              stroke="#B92770"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 10V16"
              stroke="#B92770"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </li>
  `;
}

export function createCartTableMarkup(
  items: CartDisplayItem[],
  summary: CartSummary,
): string {
  const discountMarkup =
    summary.discount > 0
      ? `
          <div class="cart-page__summary-row">
            <span>Discount (10%)</span>
            <span>-${formatPrice(summary.discount)}</span>
          </div>
        `
      : "";

  return `
    <div class="cart-page__content">
      <div class="cart-page__table-wrap">
        <div class="cart-page__head" aria-hidden="true">
          <span class="cart-page__head-cell cart-page__head-cell--image">Image</span>
          <span class="cart-page__head-cell cart-page__head-cell--name">Product Name</span>
          <span class="cart-page__head-cell cart-page__head-cell--price">Price</span>
          <span class="cart-page__head-cell cart-page__head-cell--quantity">Quantity</span>
          <span class="cart-page__head-cell cart-page__head-cell--total">Total</span>
          <span class="cart-page__head-cell cart-page__head-cell--delete">Delete</span>
        </div>

        <ul class="cart-page__list">
          ${items.map(createCartItemMarkup).join("")}
        </ul>
      </div>

      <div class="cart-page__footer">
        <div class="cart-page__actions">
          <a href="/html/catalog.html" class="btn btn--lg cart-page__action-btn">
            Continue Shopping
          </a>
          <button
            class="btn btn--lg cart-page__action-btn"
            type="button"
            data-cart-action="clear"
          >
            Clear Shopping Cart
          </button>
        </div>

        <aside class="cart-page__summary" aria-label="Order summary">
          <div class="cart-page__summary-row">
            <span>Sub Total</span>
            <span>${formatPrice(summary.subtotal)}</span>
          </div>
          ${discountMarkup}
          <div class="cart-page__summary-row">
            <span>Shipping</span>
            <span>${formatPrice(summary.shipping)}</span>
          </div>
          <div class="cart-page__summary-row cart-page__summary-row--total">
            <span>Total</span>
            <span>${formatPrice(summary.total)}</span>
          </div>

          <button
            class="btn btn--lg cart-page__checkout-btn"
            type="button"
            data-cart-action="checkout"
          >
            Checkout
          </button>
        </aside>
      </div>
    </div>
  `;
}

export function createEmptyStateMarkup(message: string): string {
  return `
    <div class="cart-page__state cart-page__state--empty">
      <p class="cart-page__state-text">${message}</p>
      <a href="/html/catalog.html" class="btn btn--lg cart-page__state-btn">
        Use the Catalog
      </a>
    </div>
  `;
}

export function createLoggedOutStateMarkup(): string {
  return `
    <div class="cart-page__state cart-page__state--login">
      <p class="cart-page__state-text">Please log in to view your cart.</p>
      <button
        class="btn btn--lg cart-page__state-btn"
        type="button"
        data-cart-action="login"
      >
        Log In
      </button>
    </div>
  `;
}

export function createCheckoutSuccessMarkup(): string {
  return `
    <div class="cart-page__state cart-page__state--success">
      <p class="cart-page__state-text">Thank you for your purchase.</p>
      <a href="/html/catalog.html" class="btn btn--lg cart-page__state-btn">
        Continue Shopping
      </a>
    </div>
  `;
}
