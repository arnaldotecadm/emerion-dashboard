/**
 * Types mirroring the ERP backend's customer endpoints (GET /api/v1/customers).
 * These reflect exactly the fields returned by the API today; the mock data in
 * `clientesData.ts` still powers the other Clientes panels (KPIs, top clients,
 * risk, region, credit, growth) until equivalent endpoints exist for those.
 */

/** A single customer row as returned by `GET /api/v1/customers`. */
export interface Customer {
  id: number;
  externalId: string;
  nomeFantasia: string;
  razaoSocial: string;
  cpfCnpj: string;
  inscricaoEstadual: string;
  regimeTributario: string;
  bloqueado: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Pagination metadata for a `CustomerPage` response. */
export interface CustomerPagination {
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

/** Paginated response envelope returned by the ERP backend. */
export interface CustomerPage {
  data: Customer[];
  pagination: CustomerPagination;
}
