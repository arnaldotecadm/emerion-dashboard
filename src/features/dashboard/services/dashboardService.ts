import type { CustomerOrderBy, DashboardTopTrends } from "../types/dashboardTopTrends";
import { API_BASE_URL, apiFetch } from "./apiConfig";

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

  return (
    isTrendList(data.topCustomers) &&
    isTrendList(data.topVendedores) &&
    typeof data.quantidadePedidos === "number" &&
    typeof data.totalFaturado === "number" &&
    typeof data.quantidadeClientes === "number" &&
    typeof data.quantidadeVendedores === "number"
  );
}

/** Fetches the aggregated dashboard metrics and rankings from the ERP backend. */
export async function fetchDashboardTopTrends(orderBy: CustomerOrderBy): Promise<DashboardTopTrends> {
  const params = new URLSearchParams({ orderby: orderBy });
  const response = await apiFetch(`${API_BASE_URL}/dashboard/top-trends?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar os dados do painel (HTTP ${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!isDashboardTopTrends(data)) {
    throw new Error("Formato inválido na resposta dos dados do painel.");
  }

  return data;
}
