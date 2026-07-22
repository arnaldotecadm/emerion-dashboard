/**
 * Types mirroring the ERP backend's customer order endpoints
 * (GET /api/v1/customer-orders).
 */

/** A single line item within a customer order. */
export interface CustomerOrderItem {
  produto: string;
  descricao: string | null;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

/** A single customer order row as returned by `GET /api/v1/customer-orders`. */
export interface CustomerOrder {
  id: number;
  externalId: string;
  /** Owning customer's externalId (codCli), matching `Customer.externalId`. */
  codCli: string;
  cnpjEmpresa: string | null;
  nronfe: string | null;
  dteres: string;
  sitres: string | null;
  totger: number;
  totres: number;
  totipi: number;
  totsub: number;
  totdescinc: number;
  itens: CustomerOrderItem[];
  createdAt: string;
  updatedAt: string;
}

/** Pagination metadata for a `CustomerOrderPage` response. */
export interface CustomerOrderPagination {
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

/** Paginated response envelope returned by the ERP backend. */
export interface CustomerOrderPage {
  data: CustomerOrder[];
  pagination: CustomerOrderPagination;
}
