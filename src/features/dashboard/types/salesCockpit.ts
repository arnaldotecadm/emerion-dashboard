export interface SalesCockpitOrder {
  customerCode: number;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  averageMarkup: number;
  orderNumber: string;
  status: string;
  salesmanName: string | null;
}

export interface SalesCockpit {
  monthlySalesTotal: number;
  averageMarkup: number;
  unpaidInvoicesCount: number;
  unpaidInvoicesAmount: number;
  customerQuotations: number;
  customerOrders: number;
  invoices: number;
  amountToReceiveThisMonth: number;
  amountReceivedThisMonth: number;
  amountDueThisMonth: number;
  recentOrders: SalesCockpitOrder[];
}
