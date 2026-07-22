/**
 * Types mirroring the ERP backend's product endpoints (GET /api/v1/products).
 */

/** A single product row as returned by `GET /api/v1/products`. */
export interface Product {
  id: number;
  externalId: string;
  nome: string;
  preco: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Pagination metadata for a `ProductPage` response. */
export interface ProductPagination {
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

/** Paginated response envelope returned by the ERP backend. */
export interface ProductPage {
  data: Product[];
  pagination: ProductPagination;
}
