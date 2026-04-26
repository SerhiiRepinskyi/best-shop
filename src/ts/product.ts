import { initProductCollections } from "./components/productCollections";

export async function initProductPage(): Promise<void> {
  await initProductCollections();
}
