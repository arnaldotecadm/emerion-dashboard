import type { DashboardTopTrend, DashboardTrendByMonth } from "./dashboardTopTrends";

export interface CustomerDistributionByRegion {
  region: string;
  customerCount: number;
}

export interface CustomerTopTrends {
  customerDistributionByRegion: CustomerDistributionByRegion[];
  activeCustomers: number;
  monthlyAverageTicket: number;
  mostProfitableCustomers: DashboardTopTrend[];
  newCustomersByMonth: DashboardTrendByMonth[];
}
