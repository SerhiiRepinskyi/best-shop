import { initProductDetails } from "./components/productDetails";
import { initProductDetailsTabs } from "./components/productDetailsTabs";
import { initProductCollections } from "./components/productCollections";

export async function initProductPage(): Promise<void> {
  await initProductDetails();
  initProductDetailsTabs();
  await initProductCollections();
}
