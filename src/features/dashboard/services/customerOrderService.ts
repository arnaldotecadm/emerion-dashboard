import type { CustomerOrder, CustomerOrderPage } from "../types/customerOrder";
import { API_BASE_URL, apiFetch } from "./apiConfig";

/**
 * Fetches a page of customer orders from the ERP backend.
 * @param page zero-based page index.
 * @param size number of rows per page.
 * @param codCli optional exact match on the owning customer's externalId.
 * @param sitres optional exact match on order status.
 */
export async function fetchCustomerOrders(
  page: number,
  size: number,
  codCli?: string,
  sitres?: string
): Promise<CustomerOrderPage> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (codCli) params.set("codCli", codCli);
  if (sitres) params.set("sitres", sitres);

  const response = await apiFetch(`${API_BASE_URL}/customer-orders?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar pedidos (HTTP ${response.status}).`);
  }

  return (await response.json()) as CustomerOrderPage;
}

/** Fetches a single customer order by id from the ERP backend. */
export async function fetchCustomerOrderById(id: string | number): Promise<CustomerOrder> {
  const response = await apiFetch(`${API_BASE_URL}/customer-orders/${id}`);

  if (!response.ok) {
    throw new Error(
      response.status === 404 || response.status === 500
        ? "Pedido não encontrado."
        : `Falha ao carregar o pedido (HTTP ${response.status}).`
    );
  }

  return (await response.json()) as CustomerOrder;
}
