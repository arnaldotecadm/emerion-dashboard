import { API_BASE_URL, apiFetch } from "./apiConfig";
import type { CustomerOrdersOverTime } from "../types/customerOrdersOverTime";

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
export async function fetchCustomerOrdersOverTime(): Promise<CustomerOrdersOverTime[]> {
  const response = await apiFetch(`${API_BASE_URL}/sales/customer-orders-over-time`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar as vendas por período (HTTP ${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!isCustomerOrdersOverTime(data)) {
    throw new Error("Formato inválido na resposta das vendas por período.");
  }

  return data.toSorted((first, second) => first.yearMonth.localeCompare(second.yearMonth));
}
