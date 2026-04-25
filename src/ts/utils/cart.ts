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

function emitCartUpdated(): void {
  document.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

function createCartItemKey(item: Pick<CartItem, "productId" | "color" | "size">): string {
  return `${item.productId}::${item.color}::${item.size}`;
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

export type { CartItem, AddToCartPayload };
