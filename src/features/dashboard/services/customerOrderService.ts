import type { CustomerOrder, CustomerOrderPage } from "../types/customerOrder";
import { API_BASE_URL, apiFetch } from "./apiConfig";

/**
 * Fetches a page of customer orders from the ERP backend.
 * @param page zero-based page index.
 * @param size number of rows per page.
 * @param codigoCliente optional exact match on the customer code.
 * @param statusPedido optional exact match on order status.
 * @param numeroPedido optional fragment match on the order number.
 */
export async function fetchCustomerOrders(
  page: number,
  size: number,
  codigoCliente?: number,
  statusPedido?: string,
  codigoEmpresa?: number,
  numeroPedido?: string
): Promise<CustomerOrderPage> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (codigoCliente !== undefined) params.set("codigoCliente", String(codigoCliente));
  if (statusPedido) params.set("statusPedido", statusPedido);
  if (codigoEmpresa !== undefined) params.set("codigoEmpresa", String(codigoEmpresa));
  if (numeroPedido?.trim()) params.set("numeroPedido", numeroPedido.trim());

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
