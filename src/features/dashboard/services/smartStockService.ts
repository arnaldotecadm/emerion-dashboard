import type { SmartStockItem } from "../types/smartStock";
import { API_BASE_URL, apiFetch } from "./apiConfig";

const MAX_PAGE_SIZE = 100;

function isSmartStockItem(value: unknown): value is SmartStockItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.codigo === "string" &&
    typeof item.descricao === "string" &&
    typeof item.origem === "string" &&
    typeof item.estoqueMinimo === "number" &&
    typeof item.estoqueAtual === "number" &&
    typeof item.custoPonderado === "number" &&
    typeof item.custoUltimaCompra === "number" &&
    typeof item.markup === "number" &&
    typeof item.leadTime === "number"
  );
}

/** Fetches one page of smart-stock items. The backend caps results at 100 per request. */
export async function fetchSmartStock(page: number, size = MAX_PAGE_SIZE): Promise<SmartStockItem[]> {
  if (!Number.isInteger(page) || page < 0) {
    throw new Error("A página do estoque deve ser um número inteiro não negativo.");
  }

  if (!Number.isInteger(size) || size < 1 || size > MAX_PAGE_SIZE) {
    throw new Error(`O tamanho da página deve estar entre 1 e ${MAX_PAGE_SIZE}.`);
  }

  const params = new URLSearchParams({ page: String(page), size: String(size) });
  const response = await apiFetch(`${API_BASE_URL}/smartStock?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar o estoque inteligente (HTTP ${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isSmartStockItem)) {
    throw new Error("Formato inválido na resposta do estoque inteligente.");
  }

  return data.slice(0, size);
}
