export type CustomerOrderBy = "QUANTIDADEPEDIDO" | "TOTALFATURADO";

export interface DashboardTopTrend {
  identifier: number;
  name: string;
  amountSales: number;
  totalSales: number;
}

export interface DashboardTopTrends {
  topCustomers: DashboardTopTrend[];
  topVendedores: DashboardTopTrend[];
  quantidadePedidos: number;
  totalFaturado: number;
  quantidadeClientes: number;
  quantidadeVendedores: number;
  ticketMedio: number;
}
