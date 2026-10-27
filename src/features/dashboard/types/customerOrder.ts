/**
 * Types mirroring the ERP backend's customer order endpoints
 * (GET /api/v1/customer-orders).
 */

/** A single line item within a customer order. */
export interface CustomerOrderItem {
  codEmp: number | null;
  dteres: string | null;
  numres: string | null;
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
  codcor: string | null;
  codtam: string | null;
  descricaoNFe: string | null;
  pesoLiquido: number | null;
  pesoBruto: number | null;
  referencia: string | null;
  quantidadeFaturada: number | null;
  quantidadeSeparada: number | null;
  custoTotal: number | null;
  lucroValor: number | null;
  lucroPorcentagem: number | null;
}

/** A single customer order row as returned by `GET /api/v1/customer-orders`. */
export interface CustomerOrder {
  id: number;
  externalId: string;
  codigoEmpresa: number | null;
  codigoCliente: number | null;
  nomeFantasia: string | null;
  cpfCnpj: string | null;
  numeroPedido: string | null;
  dataPedido: string | null;
  statusPedido: string | null;
  totalPedidoComImpostos: number | null;
  totalPedidoSemImpostos: number | null;
  totalIpi: number | null;
  totalIcms: number | null;
  totalPis: number | null;
  totalCofins: number | null;
  totalSubstituicaoTributaria: number | null;
  totalDescontoIncondicional: number | null;
  totalFrete: number | null;
  totalSeguro: number | null;
  totalOutrasDespesas: number | null;
  vendedorExternalId: number | null;
  dataEntregaPrevista: string | null;
  codigoTransportadora: string | null;
  pedidoAnterior: string | null;
  regimeTributario: string | null;
  nomeRegimeTributario: string | null;
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
