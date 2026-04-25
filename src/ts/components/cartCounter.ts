import { AUTH_UPDATED_EVENT, isUserLoggedIn } from "../utils/auth";
import { CART_UPDATED_EVENT, getCartItemsCount } from "../utils/cart";

function renderCartCounter(): void {
  const counter = document.querySelector<HTMLElement>("[data-cart-count]");

  if (!counter) {
    return;
  }

  if (!isUserLoggedIn()) {
    counter.hidden = true;
    counter.textContent = "";
    return;
  }

  const itemsCount = getCartItemsCount();

  if (itemsCount <= 0) {
    counter.hidden = true;
    counter.textContent = "";
    return;
  }

  counter.hidden = false;
  counter.textContent = String(itemsCount);
}

export function initCartCounter(): void {
  renderCartCounter();
  document.addEventListener(CART_UPDATED_EVENT, renderCartCounter);
  document.addEventListener(AUTH_UPDATED_EVENT, renderCartCounter);
}
