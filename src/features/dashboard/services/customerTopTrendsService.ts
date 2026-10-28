import { API_BASE_URL, apiFetch } from "./apiConfig";
import type { CustomerTopTrends } from "../types/customerTopTrends";
import type { DashboardYears } from "../types/dashboardTopTrends";

function isCustomerTopTrends(value: unknown): value is CustomerTopTrends {
  if (typeof value !== "object" || value === null) return false;

  const data = value as Record<string, unknown>;
  const isTrendList = (items: unknown): boolean =>
    Array.isArray(items) &&
    items.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.identifier === "number" &&
        typeof item.name === "string" &&
        typeof item.amountSales === "number" &&
        Number.isFinite(item.amountSales) &&
        typeof item.totalSales === "number" &&
        Number.isFinite(item.totalSales)
    );
  const isMonthlyCountList = (items: unknown): boolean =>
    Array.isArray(items) &&
    items.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.yearMonth === "string" &&
        /^\d{4}-(0[1-9]|1[0-2])$/.test(item.yearMonth) &&
        typeof item.count === "number" &&
        Number.isInteger(item.count) &&
        item.count >= 0
    );
  const isRegionList = (items: unknown): boolean =>
    Array.isArray(items) &&
    items.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.region === "string" &&
        typeof item.customerCount === "number" &&
        Number.isFinite(item.customerCount) &&
        item.customerCount >= 0
    );

  return (
    isRegionList(data.customerDistributionByRegion) &&
    typeof data.activeCustomers === "number" &&
    Number.isInteger(data.activeCustomers) &&
    data.activeCustomers >= 0 &&
    typeof data.monthlyAverageTicket === "number" &&
    Number.isFinite(data.monthlyAverageTicket) &&
    isTrendList(data.mostProfitableCustomers) &&
    isMonthlyCountList(data.newCustomersByMonth)
  );
}

/** Fetches the aggregated customer metrics and trends from the ERP backend. */
export async function fetchCustomerTopTrends(years: DashboardYears = null): Promise<CustomerTopTrends> {
  const params = new URLSearchParams();
  const headers = years === null ? undefined : { years: String(years) };
  if (years !== null) params.set("years", String(years));

  const query = params.size > 0 ? `?${params.toString()}` : "";
  const response = await apiFetch(`${API_BASE_URL}/dashboard/customer-top-trends${query}`, { headers });

  if (!response.ok) {
    throw new Error(`Falha ao carregar os indicadores de clientes (HTTP ${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!isCustomerTopTrends(data)) {
    throw new Error("Formato inválido na resposta dos indicadores de clientes.");
  }

  return data;
}
