import {
  createCartTableMarkup,
  createCheckoutSuccessMarkup,
  createEmptyStateMarkup,
  createLoggedOutStateMarkup,
} from "./components/cartPageContent";
import { LOGIN_MODAL_OPEN_EVENT } from "./components/loginModal";
import { AUTH_UPDATED_EVENT, isUserLoggedIn } from "./utils/auth";
import {
  CART_UPDATED_EVENT,
  clearCart,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "./utils/cart";
import { getProductData } from "./utils/productData";
import { getCartSummary, getResolvedCartItems } from "./utils/cartSummary";

function requestLoginModalOpen(): void {
  document.dispatchEvent(new CustomEvent(LOGIN_MODAL_OPEN_EVENT));
}

export function initCartPage(): void {
  const root = document.querySelector<HTMLElement>("[data-cart-page]");

  if (!root) {
    return;
  }

  let hasCheckoutSuccess = false;
  let productPriceMap = new Map<string, number>();

  const render = (): void => {
    if (!isUserLoggedIn()) {
      hasCheckoutSuccess = false;
      root.innerHTML = createLoggedOutStateMarkup();
      return;
    }

    if (hasCheckoutSuccess) {
      root.innerHTML = createCheckoutSuccessMarkup();
      return;
    }

    const items = getCartItems();

    if (items.length === 0) {
      root.innerHTML = createEmptyStateMarkup(
        "Your cart is empty. Use the catalog to add new items.",
      );
      return;
    }

    const displayItems = getResolvedCartItems(items, productPriceMap);
    const summary = getCartSummary(displayItems);

    root.innerHTML = createCartTableMarkup(displayItems, summary);
  };

  const syncProductPrices = async (): Promise<void> => {
    try {
      const products = await getProductData();
      productPriceMap = new Map(
        products.map((product) => [product.id, product.price] as const),
      );
      render();
    } catch (error) {
      console.error(error);
    }
  };

  const getItemIdentityFromTrigger = (trigger: HTMLElement) => {
    const name = trigger.dataset.productName;
    const color = trigger.dataset.productColor;
    const size = trigger.dataset.productSize;

    if (!name || !color || !size) {
      return null;
    }

    return {
      name,
      color,
      size,
    };
  };

  root.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const trigger = target.closest<HTMLButtonElement>("[data-cart-action]");

    if (!trigger) {
      return;
    }

    const action = trigger.dataset.cartAction;

    if (action === "login") {
      requestLoginModalOpen();
      return;
    }

    if (action === "clear") {
      hasCheckoutSuccess = false;
      clearCart();
      return;
    }

    if (action === "checkout") {
      hasCheckoutSuccess = true;
      clearCart();
      render();
      return;
    }

    const identity = getItemIdentityFromTrigger(trigger);

    if (!identity) {
      return;
    }

    const item = getCartItems().find(
      (cartItem) =>
        cartItem.name === identity.name &&
        cartItem.color === identity.color &&
        cartItem.size === identity.size,
    );

    if (!item) {
      return;
    }

    if (action === "increase") {
      updateCartItemQuantity(identity, item.quantity + 1);
      return;
    }

    if (action === "decrease") {
      updateCartItemQuantity(identity, item.quantity - 1);
      return;
    }

    if (action === "remove") {
      removeCartItem(identity);
    }
  });

  document.addEventListener(CART_UPDATED_EVENT, () => {
    if (!hasCheckoutSuccess) {
      render();
    }
  });

  document.addEventListener(AUTH_UPDATED_EVENT, render);

  render();
  void syncProductPrices();
}
