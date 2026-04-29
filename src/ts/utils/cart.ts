import { getFromStorage, setToStorage } from "./storage";

const CART_STORAGE_KEY = "best-shop-cart";
export const CART_UPDATED_EVENT = "cart:updated";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  color: string;
  size: string;
};

type AddToCartPayload = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartItemIdentity = Pick<CartItem, "name" | "color" | "size">;

function emitCartUpdated(): void {
  document.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

function createCartItemKey(item: CartItemIdentity): string {
  return `${item.name}::${item.color}::${item.size}`;
}

export function getCartItems(): CartItem[] {
  return getFromStorage<CartItem[]>(CART_STORAGE_KEY) ?? [];
}

export function setCartItems(items: CartItem[]): void {
  setToStorage(CART_STORAGE_KEY, items);
  emitCartUpdated();
}

export function addToCart(payload: AddToCartPayload): CartItem[] {
  const items = getCartItems();
  const itemKey = createCartItemKey(payload);
  const existingItemIndex = items.findIndex(
    (item) => createCartItemKey(item) === itemKey,
  );

  if (existingItemIndex >= 0) {
    const nextItems = items.map((item, index) => {
      if (index !== existingItemIndex) {
        return item;
      }

      return {
        ...item,
        quantity: item.quantity + (payload.quantity ?? 1),
      };
    });

    setCartItems(nextItems);
    return nextItems;
  }

  const nextItems = [
    ...items,
    {
      ...payload,
      quantity: payload.quantity ?? 1,
    },
  ];

  setCartItems(nextItems);
  return nextItems;
}

export function getCartItemsCount(): number {
  return getCartItems().reduce((total, item) => total + item.quantity, 0);
}

export function updateCartItemQuantity(
  identity: CartItemIdentity,
  quantity: number,
): CartItem[] {
  const nextQuantity = Math.max(quantity, 1);
  const nextItems = getCartItems().map((item) => {
    if (createCartItemKey(item) !== createCartItemKey(identity)) {
      return item;
    }

    return {
      ...item,
      quantity: nextQuantity,
    };
  });

  setCartItems(nextItems);
  return nextItems;
}

export function removeCartItem(identity: CartItemIdentity): CartItem[] {
  const nextItems = getCartItems().filter(
    (item) => createCartItemKey(item) !== createCartItemKey(identity),
  );

  setCartItems(nextItems);
  return nextItems;
}

export function clearCart(): void {
  setCartItems([]);
}

export function getCartSubtotal(): number {
  return getCartItems().reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}

export type { CartItem, AddToCartPayload, CartItemIdentity };
