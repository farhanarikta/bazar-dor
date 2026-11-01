
const API_BASE_URL = "https://openapi.programming-hero.com/api/bazardor";

export const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;
export const CATEGORIES_ENDPOINT = `${API_BASE_URL}/categories`;

export async function getProducts(): Promise<unknown> {
  const response = await fetch(PRODUCTS_ENDPOINT);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getCategories(): Promise<unknown> {
  const response = await fetch(CATEGORIES_ENDPOINT);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

