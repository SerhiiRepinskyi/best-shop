import { LOGIN_MODAL_OPEN_EVENT } from "./loginModal";
import {
  createProductDetailsFallbackMarkup,
  createProductDetailsMarkup,
} from "./productDetailsContent";
import { addToCart } from "../utils/cart";
import { isUserLoggedIn } from "../utils/auth";
import { getProductData } from "../utils/productData";

function requestLoginModalOpen(): void {
  document.dispatchEvent(new CustomEvent(LOGIN_MODAL_OPEN_EVENT));
}

export async function initProductDetails(): Promise<void> {
  const root = document.querySelector<HTMLElement>("[data-product-details]");

  if (!root) {
    return;
  }

  try {
    const products = await getProductData();

    if (products.length === 0) {
      root.innerHTML = createProductDetailsFallbackMarkup(
        "Product data is not available right now.",
      );
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const productId = searchParams.get("id");
    const product =
      products.find((item) => item.id === productId) ?? products[0];

    let quantity = 1;

    root.innerHTML = createProductDetailsMarkup(product);
    document.title = `Best Shop | ${product.name}`;

    const quantityValue = root.querySelector<HTMLElement>(
      "[data-product-quantity-value]",
    );
    const addToCartButton = root.querySelector<HTMLButtonElement>(
      "[data-product-add-to-cart]",
    );
    const sizeSelect = root.querySelector<HTMLSelectElement>("[data-product-size]");
    const colorSelect = root.querySelector<HTMLSelectElement>("[data-product-color]");

    const updateQuantityValue = (): void => {
      if (quantityValue) {
        quantityValue.textContent = String(quantity);
      }
    };

    root.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const quantityTrigger = target.closest<HTMLElement>("[data-product-quantity]");

      if (quantityTrigger) {
        const action = quantityTrigger.dataset.productQuantity;

        if (action === "increase") {
          quantity += 1;
          updateQuantityValue();
          return;
        }

        if (action === "decrease") {
          quantity = Math.max(1, quantity - 1);
          updateQuantityValue();
          return;
        }
      }

      if (!target.closest("[data-product-add-to-cart]")) {
        return;
      }

      if (!isUserLoggedIn()) {
        requestLoginModalOpen();
        return;
      }

      const selectedSize = sizeSelect?.value ?? product.size;
      const selectedColor = colorSelect?.value ?? product.color;

      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        color: selectedColor,
        size: selectedSize,
        quantity,
      });
    });

    if (addToCartButton) {
      addToCartButton.disabled = false;
    }
  } catch (error) {
    console.error(error);
    root.innerHTML = createProductDetailsFallbackMarkup(
      "Unable to load product details right now.",
    );
  }
}
