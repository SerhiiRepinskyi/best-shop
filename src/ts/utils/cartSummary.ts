import type { CartItem } from "./cart";

const SHIPPING_PRICE = 30;
const DISCOUNT_THRESHOLD = 3000;
const DISCOUNT_RATE = 0.1;

type CartDisplayItem = CartItem & {
  unitPrice: number;
  lineTotal: number;
};

type CartSummary = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

export function getResolvedCartItems(
  items: CartItem[],
  productPriceMap: Map<string, number>,
): CartDisplayItem[] {
  return items.map((item) => {
    const unitPrice = productPriceMap.get(item.productId) ?? item.price;

    return {
      ...item,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    };
  });
}

export function getCartSummary(items: CartDisplayItem[]): CartSummary {
  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const discount =
    subtotal > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
  const shipping = SHIPPING_PRICE;
  const total = subtotal - discount + shipping;

  return {
    subtotal,
    discount,
    shipping,
    total,
  };
}

export type { CartDisplayItem, CartSummary };
