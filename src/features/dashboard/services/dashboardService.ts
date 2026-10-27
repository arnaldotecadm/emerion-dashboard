import type { CustomerOrderBy, DashboardTopTrends, DashboardYears } from "../types/dashboardTopTrends";
import { API_BASE_URL, apiFetch } from "./apiConfig";

export class DashboardAccessDeniedError extends Error {
  constructor() {
    super("Não tem permissão para aceder ao painel.");
    this.name = "DashboardAccessDeniedError";
  }
}

function isDashboardTopTrends(value: unknown): value is DashboardTopTrends {
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
        typeof item.totalSales === "number"
    );
  const isMonthlyTrendList = (items: unknown): boolean =>
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
  const isRegionalTrendList = (items: unknown): boolean =>
    Array.isArray(items) &&
    items.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.region === "string" &&
        typeof item.faturado === "number" &&
        Number.isFinite(item.faturado) &&
        typeof item.cancelado === "number" &&
        Number.isFinite(item.cancelado) &&
        typeof item.outros === "number" &&
        Number.isFinite(item.outros)
    );

  return (
    isTrendList(data.topCustomers) &&
    isTrendList(data.topVendedores) &&
    isMonthlyTrendList(data.customerOrders) &&
    isMonthlyTrendList(data.customerQuotations) &&
    isRegionalTrendList(data.ordersByRegion) &&
    typeof data.quantidadePedidos === "number" &&
    typeof data.totalFaturado === "number" &&
    typeof data.quantidadeClientes === "number" &&
    typeof data.quantidadeVendedores === "number"
  );
}

/**
 * Fetches aggregated dashboard metrics and rankings. The optional `years`
 * request header limits the backend result; omitting it returns all available data.
 */
export async function fetchDashboardTopTrends(
  orderBy: CustomerOrderBy,
  years: DashboardYears = null
): Promise<DashboardTopTrends> {
  const params = new URLSearchParams({ orderby: orderBy });
  const headers = years === null ? undefined : { years: String(years) };
  if (years !== null) params.set("years", String(years));
  const response = await apiFetch(`${API_BASE_URL}/dashboard/top-trends?${params.toString()}`, { headers });

  if (!response.ok) {
    if (response.status === 403) {
      throw new DashboardAccessDeniedError();
    }

    throw new Error(`Falha ao carregar os dados do painel (HTTP ${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!isDashboardTopTrends(data)) {
    throw new Error("Formato inválido na resposta dos dados do painel.");
  }

  return data;
}
