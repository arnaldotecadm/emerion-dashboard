import type { DashboardTopTrend, DashboardTrendByMonth } from "./dashboardTopTrends";

export interface CustomerDistributionByRegion {
  region: string;
  customerCount: number;
}

export interface OverdueInvoice {
  customerCode: string | number;
  customerName: string;
  amount: number;
  dueDate: string;
  description: string;
}

export interface CustomerTopTrends {
  customerDistributionByRegion: CustomerDistributionByRegion[];
  activeCustomers: number;
  monthlyAverageTicket: number;
  unpaidInvoicesAmount: number;
  overdueInvoices: OverdueInvoice[];
  mostProfitableCustomers: DashboardTopTrend[];
  newCustomersByMonth: DashboardTrendByMonth[];
}
