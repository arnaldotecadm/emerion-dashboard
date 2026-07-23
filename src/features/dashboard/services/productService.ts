import type { Product, ProductPage } from "../types/product";
import { API_BASE_URL, apiFetch } from "./apiConfig";

/**
 * Fetches a page of products from the ERP backend.
 * @param page zero-based page index.
 * @param size number of rows per page.
 */
export async function fetchProducts(page: number, size: number): Promise<ProductPage> {
  const response = await apiFetch(`${API_BASE_URL}/products?page=${page}&size=${size}`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar produtos (HTTP ${response.status}).`);
  }

  return (await response.json()) as ProductPage;
}

/** Fetches a single product by id from the ERP backend. */
export async function fetchProductById(id: string | number): Promise<Product> {
  const response = await apiFetch(`${API_BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error(
      response.status === 404 || response.status === 500
        ? "Produto não encontrado."
        : `Falha ao carregar o produto (HTTP ${response.status}).`
    );
  }

  return (await response.json()) as Product;
}

/** Fetches a single product by its ERP `externalId` from the ERP backend. */
export async function fetchProductByExternalId(externalId: string): Promise<Product> {
  const response = await apiFetch(`${API_BASE_URL}/products/by-external-id/${externalId}`);

  if (!response.ok) {
    throw new Error(
      response.status === 404 || response.status === 500
        ? "Produto não encontrado."
        : `Falha ao carregar o produto (HTTP ${response.status}).`
    );
  }

  return (await response.json()) as Product;
}
