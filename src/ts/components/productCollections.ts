import { LOGIN_MODAL_OPEN_EVENT } from "./loginModal";
import { createProductCardMarkup } from "./productCards";
import { isUserLoggedIn } from "../utils/auth";
import { addToCart } from "../utils/cart";
import { getProductData, type ProductDataItem } from "../utils/productData";

type CollectionMode = "random" | "block";
const SETS_CATEGORY = "luggage sets";

function requestLoginModalOpen(): void {
  document.dispatchEvent(new CustomEvent(LOGIN_MODAL_OPEN_EVENT));
}

function shuffleItems<T>(items: T[]): T[] {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [
      nextItems[swapIndex],
      nextItems[index],
    ];
  }

  return nextItems;
}

function getCollectionItems(
  items: ProductDataItem[],
  collectionRoot: HTMLElement,
): ProductDataItem[] {
  const mode = (collectionRoot.dataset.collectionMode ?? "random") as CollectionMode;
  const count = Number(collectionRoot.dataset.collectionCount ?? 4);

  if (mode === "block") {
    const blockName = collectionRoot.dataset.collectionBlock;

    if (!blockName) {
      return [];
    }

    return items.filter((item) => item.blocks.includes(blockName)).slice(0, count);
  }

  return shuffleItems(items.filter((item) => item.category !== SETS_CATEGORY)).slice(
    0,
    count,
  );
}

function bindCollectionCartActions(
  collectionRoot: HTMLElement,
  productItemsMap: Map<string, ProductDataItem>,
): void {
  collectionRoot.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const addToCartButton = target.closest<HTMLButtonElement>("[data-product-id]");

    if (!addToCartButton) {
      return;
    }

    const productId = addToCartButton.dataset.productId;

    if (!productId) {
      return;
    }

    if (!isUserLoggedIn()) {
      requestLoginModalOpen();
      return;
    }

    const product = productItemsMap.get(productId);

    if (!product) {
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      color: product.color,
      size: product.size,
    });
  });
}

export async function initProductCollections(): Promise<void> {
  const collectionRoots = document.querySelectorAll<HTMLElement>(
    "[data-product-collection-root]",
  );

  if (collectionRoots.length === 0) {
    return;
  }

  try {
    const items = await getProductData();
    const productItemsMap = new Map(items.map((item) => [item.id, item] as const));

    collectionRoots.forEach((collectionRoot) => {
      const list = collectionRoot.querySelector<HTMLElement>(
        "[data-product-collection-list]",
      );

      if (!list) {
        return;
      }

      const collectionItems = getCollectionItems(items, collectionRoot);
      list.innerHTML = collectionItems.map(createProductCardMarkup).join("");
      bindCollectionCartActions(collectionRoot, productItemsMap);
    });
  } catch (error) {
    console.error(error);

    collectionRoots.forEach((collectionRoot) => {
      const list = collectionRoot.querySelector<HTMLElement>(
        "[data-product-collection-list]",
      );

      if (!list) {
        return;
      }

      list.innerHTML =
        '<li class="product-collection__empty">Unable to load products right now.</li>';
    });
  }
}
