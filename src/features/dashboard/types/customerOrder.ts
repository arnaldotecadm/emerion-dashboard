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
  seqRe2: number;
  codClp: string | null;
  codSt1: string | null;
  codUnd: string | null;
  vluRe2: number | null;
  dscRe2: number | null;
  dsrRe2: number | null;
  icmsAliquota: number | null;
  icmsBase: number | null;
  icmsValor: number | null;
  icmsReducaoBase: number | null;
  icmsSubstituicaoBase: number | null;
  icmsSubstituicaoValor: number | null;
  icmsSubstituicaoAliquota: number | null;
  icmsSubstituicaoMargem: number | null;
  icmsSubstituicaoReducaoBase: number | null;
  ipiAliquota: number | null;
  ipiBase: number | null;
  ipiValor: number | null;
  ipiClassificacao: string | null;
  ipiCst: string | null;
  pisBase: number | null;
  pisAliquota: number | null;
  pisValor: number | null;
  pisCst: string | null;
  cofinsBase: number | null;
  cofinsAliquota: number | null;
  cofinsValor: number | null;
  cofinsCst: string | null;
  descontoValor: number | null;
  freteValor: number | null;
  seguroValor: number | null;
  outrasDespesasValor: number | null;
  totalItemTributado: number | null;
  totRen: number | null;
  totGe2: number | null;
  observacao: string | null;
  pedidoCompraCliente: string | null;
  itemPedidoCompraCliente: number | null;
  nroRe2: number | null;
  flgVal: string | null;
  flgPac: string | null;
  flgLib: string | null;
  codCfo: string | null;
}

/** A single customer order row as returned by `GET /api/v1/customer-orders`. */
export interface CustomerOrder {
  id: number;
  externalId: string;
  /** Owning customer's externalId (codCli), matching `Customer.externalId`. */
  codCli: string;
  cnpjEmpresa: string | null;
  cpfCnpj: string | null;
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
