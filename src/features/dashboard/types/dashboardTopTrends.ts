export type CustomerOrderBy = "QUANTIDADEPEDIDO" | "TOTALFATURADO";
export type DashboardYears = 1 | 2 | null;

export interface DashboardTopTrend {
  identifier: number;
  name: string;
  amountSales: number;
  totalSales: number;
}

export interface DashboardTrendByMonth {
  yearMonth: string;
  count: number;
}

export interface DashboardOrdersByRegion {
  region: string;
  faturado: number;
  cancelado: number;
  outros: number;
}

export interface DashboardTopTrends {
  topCustomers: DashboardTopTrend[];
  topVendedores: DashboardTopTrend[];
  customerOrders: DashboardTrendByMonth[];
  customerQuotations: DashboardTrendByMonth[];
  ordersByRegion: DashboardOrdersByRegion[];
  quantidadePedidos: number;
  totalFaturado: number;
  quantidadeClientes: number;
  quantidadeVendedores: number;
  ticketMedio: number;
}
