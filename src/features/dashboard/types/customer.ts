/**
 * Types mirroring the ERP backend's customer endpoints (GET /customer/all).
 * These reflect exactly the fields returned by the API today; the mock data in
 * `clientesData.ts` still powers the other Clientes panels (KPIs, top clients,
 * risk, region, credit, growth) until equivalent endpoints exist for those.
 */

/** A single customer row as returned by `GET /customer/all`. */
export interface Customer {
  id: number;
  nomeFantasia: string;
  razaoSocial: string;
  cpfCnpj: string;
  inscricaoEstadual: string;
  regimeTributario: string;
  bloqueado: boolean;
}

/** Spring Data-style paginated response envelope. */
export interface CustomerPage {
  content: Customer[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
