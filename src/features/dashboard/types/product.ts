/**
 * Types mirroring the ERP backend's product endpoints (GET /api/v1/products).
 */

/** A single product row as returned by `GET /api/v1/products`. */
export interface Product {
  id: number;
  externalId: string;
  cnpjEmpresa: string | null;
  nome: string;
  descricaoReduzida: string | null;
  referenciaInterna: string | null;
  ncm: string | null;
  cest: string | null;
  origemProduto: string | null;
  categoria: string | null;
  tipo: string | null;
  marca: string | null;
  unidade: string | null;
  pesoLiquido: number | null;
  pesoBruto: number | null;
  descontinuado: boolean;
  codigoBarras: string | null;
  codigoBarrasProprio: string | null;
  preco: number | null;
  preco2: number | null;
  preco3: number | null;
  preco4: number | null;
  preco5: number | null;
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
