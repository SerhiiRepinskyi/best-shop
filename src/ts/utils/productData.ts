const PRODUCT_DATA_URL = "/assets/data.json";

type ProductDataItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  color: string;
  size: string;
  salesStatus: boolean;
  rating: number;
  popularity: number;
};

type ProductDataResponse = {
  data: ProductDataItem[];
};

export async function getProductData(): Promise<ProductDataItem[]> {
  const response = await fetch(PRODUCT_DATA_URL);

  if (!response.ok) {
    throw new Error("Failed to load product data.");
  }

  const payload: ProductDataResponse = await response.json();
  return payload.data;
}

export type { ProductDataItem, ProductDataResponse };
