/**
 * Types mirroring the ERP backend's vendedor (salesman) endpoints
 * (GET /api/v1/vendedores).
 */

/** A single vendedor row as returned by `GET /api/v1/vendedores`. */
export interface Vendedor {
  id: number;
  externalId: string;
  nome: string;
  apelido: string | null;
  cpfCnpj: string | null;
  telefone: string | null;
  celular: string | null;
  email: string | null;
  cidade: string | null;
  uf: string | null;
  situacao: string | null;
  saldo: number | null;
  dataCadastro: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Pagination metadata for a `VendedorPage` response. */
export interface VendedorPagination {
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

/** Paginated response envelope returned by the ERP backend. */
export interface VendedorPage {
  data: Vendedor[];
  pagination: VendedorPagination;
}
