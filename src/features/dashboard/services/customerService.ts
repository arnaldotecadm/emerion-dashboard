import type { Customer, CustomerPage } from "../types/customer";
import { API_BASE_URL } from "./apiConfig";

/**
 * Fetches a page of customers from the ERP backend.
 * @param page zero-based page index (Spring Data convention).
 * @param size number of rows per page.
 */
export async function fetchCustomers(page: number, size: number): Promise<CustomerPage> {
  const response = await fetch(`${API_BASE_URL}/customers?page=${page}&size=${size}`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar clientes (HTTP ${response.status}).`);
  }

  return (await response.json()) as CustomerPage;
}

/** Fetches a single customer by id from the ERP backend. */
export async function fetchCustomerById(id: string | number): Promise<Customer> {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`);

  if (!response.ok) {
    throw new Error(
      response.status === 404 || response.status === 500
        ? "Cliente não encontrado."
        : `Falha ao carregar o cliente (HTTP ${response.status}).`
    );
  }

  return (await response.json()) as Customer;
}

