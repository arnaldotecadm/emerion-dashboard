import { API_BASE_URL, apiFetch } from "./apiConfig";
import type { CustomerTopTrends } from "../types/customerTopTrends";

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
  const isOverdueInvoiceList = (items: unknown): boolean =>
    Array.isArray(items) &&
    items.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        ((typeof item.customerCode === "string" && item.customerCode.length > 0) ||
          (typeof item.customerCode === "number" && Number.isFinite(item.customerCode))) &&
        typeof item.customerName === "string" &&
        typeof item.amount === "number" &&
        Number.isFinite(item.amount) &&
        typeof item.dueDate === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(item.dueDate) &&
        typeof item.description === "string"
    );

  return (
    isRegionList(data.customerDistributionByRegion) &&
    typeof data.activeCustomers === "number" &&
    Number.isInteger(data.activeCustomers) &&
    data.activeCustomers >= 0 &&
    typeof data.monthlyAverageTicket === "number" &&
    Number.isFinite(data.monthlyAverageTicket) &&
    typeof data.unpaidInvoicesAmount === "number" &&
    Number.isFinite(data.unpaidInvoicesAmount) &&
    isOverdueInvoiceList(data.overdueInvoices) &&
    isTrendList(data.mostProfitableCustomers) &&
    isMonthlyCountList(data.newCustomersByMonth)
  );
}

/** Fetches aggregated customer metrics and trends from the ERP backend. */
export async function fetchCustomerTopTrends(
  startDate: string,
  endDate: string
): Promise<CustomerTopTrends> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  const response = await apiFetch(`${API_BASE_URL}/dashboard/customer-top-trends?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar os indicadores de clientes (HTTP ${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!isCustomerTopTrends(data)) {
    throw new Error("Formato inválido na resposta dos indicadores de clientes.");
  }

  return data;
}
