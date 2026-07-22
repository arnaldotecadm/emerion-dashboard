import type { Vendedor, VendedorPage } from "../types/vendedor";
import { API_BASE_URL } from "./apiConfig";

/**
 * Fetches a page of vendedores (salesmen) from the ERP backend.
 * @param page zero-based page index.
 * @param size number of rows per page.
 * @param nome optional partial, case-insensitive match on vendedor nome.
 * @param situacao optional exact match on vendedor situacao.
 */
export async function fetchVendedores(
  page: number,
  size: number,
  nome?: string,
  situacao?: string
): Promise<VendedorPage> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (nome) params.set("nome", nome);
  if (situacao) params.set("situacao", situacao);

  const response = await fetch(`${API_BASE_URL}/vendedores?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar vendedores (HTTP ${response.status}).`);
  }

  return (await response.json()) as VendedorPage;
}

/** Fetches a single vendedor by id from the ERP backend. */
export async function fetchVendedorById(id: string | number): Promise<Vendedor> {
  const response = await fetch(`${API_BASE_URL}/vendedores/${id}`);

  if (!response.ok) {
    throw new Error(
      response.status === 404 || response.status === 500
        ? "Vendedor não encontrado."
        : `Falha ao carregar o vendedor (HTTP ${response.status}).`
    );
  }

  return (await response.json()) as Vendedor;
}
