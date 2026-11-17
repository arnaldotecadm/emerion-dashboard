import { API_BASE_URL, apiFetch } from "./apiConfig";
import type { CustomerOrdersOverTime } from "../types/customerOrdersOverTime";
import type { CustomerOrderBy, DashboardTopTrend } from "../types/dashboardTopTrends";

function isCustomerOrdersOverTime(value: unknown): value is CustomerOrdersOverTime[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.yearMonth === "string" &&
        /^\d{4}-(0[1-9]|1[0-2])$/.test(item.yearMonth) &&
        typeof item.orderCount === "number" &&
        Number.isInteger(item.orderCount) &&
        item.orderCount >= 0 &&
        typeof item.amountSold === "number" &&
        Number.isFinite(item.amountSold)
    )
  );
}

/** Fetches monthly order counts and sales totals from the ERP backend. */
export async function fetchCustomerOrdersOverTime(startDate: string, endDate: string): Promise<CustomerOrdersOverTime[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  const response = await apiFetch(`${API_BASE_URL}/sales/customer-orders-over-time?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar as vendas por período (HTTP ${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!isCustomerOrdersOverTime(data)) {
    throw new Error("Formato inválido na resposta das vendas por período.");
  }

  return data.toSorted((first, second) => first.yearMonth.localeCompare(second.yearMonth));
}

function isSellerTrendList(value: unknown): value is DashboardTopTrend[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.identifier === "number" &&
        typeof item.name === "string" &&
        typeof item.amountSales === "number" &&
        typeof item.totalSales === "number"
    )
  );
}

/** Fetches the sales ranking of sellers from the ERP backend. */
export async function fetchSellerTopTrends(
  orderBy: CustomerOrderBy,
  startDate: string,
  endDate: string
): Promise<DashboardTopTrend[]> {
  const params = new URLSearchParams({ orderby: orderBy });
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const response = await apiFetch(`${API_BASE_URL}/sales/seller-top-trends?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar o ranking de vendedores (HTTP ${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!isSellerTrendList(data)) {
    throw new Error("Formato inválido na resposta do ranking de vendedores.");
  }

  return data;
}
