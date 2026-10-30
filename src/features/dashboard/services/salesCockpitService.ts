import { API_BASE_URL, apiFetch } from "./apiConfig";
import type { SalesCockpit } from "../types/salesCockpit";

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isSalesCockpit(value: unknown): value is SalesCockpit {
  if (typeof value !== "object" || value === null) return false;

  const data = value as Record<string, unknown>;
  const isCount = (candidate: unknown): candidate is number =>
    typeof candidate === "number" && Number.isInteger(candidate) && candidate >= 0;
  const isOrderList = (items: unknown): items is SalesCockpit["recentOrders"] =>
    Array.isArray(items) &&
    items.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.customerCode === "number" &&
        Number.isFinite(item.customerCode) &&
        typeof item.customerName === "string" &&
        typeof item.orderDate === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(item.orderDate) &&
        isNonNegativeNumber(item.totalAmount) &&
        typeof item.averageMarkup === "number" &&
        Number.isFinite(item.averageMarkup) &&
        typeof item.orderNumber === "string" &&
        typeof item.status === "string" &&
        (typeof item.salesmanName === "string" || item.salesmanName === null)
    );

  return (
    isNonNegativeNumber(data.monthlySalesTotal) &&
    typeof data.averageMarkup === "number" &&
    Number.isFinite(data.averageMarkup) &&
    isCount(data.unpaidInvoicesCount) &&
    isNonNegativeNumber(data.unpaidInvoicesAmount) &&
    isCount(data.customerQuotations) &&
    isCount(data.customerOrders) &&
    isCount(data.invoices) &&
    isNonNegativeNumber(data.amountToReceiveThisMonth) &&
    isNonNegativeNumber(data.amountReceivedThisMonth) &&
    isNonNegativeNumber(data.amountDueThisMonth) &&
    isOrderList(data.recentOrders)
  );
}

/** Fetches the real-time executive sales cockpit aggregates and recent orders. */
export async function fetchSalesCockpit(): Promise<SalesCockpit> {
  const response = await apiFetch(`${API_BASE_URL}/dashboard/sales-cockpit`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar o cockpit de vendas (HTTP ${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!isSalesCockpit(data)) {
    throw new Error("Formato inválido na resposta do cockpit de vendas.");
  }

  return data;
}
