import { initProductDetails } from "./components/productDetails";
import { initProductCollections } from "./components/productCollections";

export async function initProductPage(): Promise<void> {
  await initProductDetails();
  await initProductCollections();
}
