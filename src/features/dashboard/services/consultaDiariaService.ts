import { API_BASE_URL, apiFetch } from "./apiConfig";
import type {
  ConsultaDiaria,
  ConsultaDiariaCustomer,
  ConsultaDiariaProduct,
  ConsultaDiariaSalesperson,
  ConsultaDiariaSalespersonTotal,
  ConsultaDiariaState,
} from "../types/consultaDiaria";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isProduct(value: unknown): value is ConsultaDiariaProduct {
  return (
    isRecord(value) &&
    typeof value.codigoGrupo === "string" &&
    typeof value.codigoSubGrupo === "string" &&
    typeof value.codigoProduto === "string" &&
    typeof value.descricaoItemLiberacao === "string" &&
    isNonNegativeNumber(value.totalSeparado)
  );
}

function isCustomer(value: unknown): value is ConsultaDiariaCustomer {
  return (
    isRecord(value) &&
    typeof value.codigoCliente === "number" &&
    Number.isInteger(value.codigoCliente) &&
    typeof value.nomeFantasia === "string" &&
    isNonNegativeNumber(value.totalLiberadoComImpostos)
  );
}

function isState(value: unknown): value is ConsultaDiariaState {
  return (
    isRecord(value) &&
    typeof value.uf === "string" &&
    isNonNegativeNumber(value.amount) &&
    isNonNegativeNumber(value.representationPercentage)
  );
}

function isSalesperson(value: unknown): value is ConsultaDiariaSalesperson {
  return (
    isRecord(value) &&
    typeof value.codigoVendedor === "number" &&
    Number.isInteger(value.codigoVendedor) &&
    typeof value.nomeVendedor === "string" &&
    Number.isInteger(value.clientesResponsaveis) &&
    Number(value.clientesResponsaveis) >= 0 &&
    Number.isInteger(value.clientesComCompra) &&
    Number(value.clientesComCompra) >= 0 &&
    isNonNegativeNumber(value.representationPercentage)
  );
}

function isSalespersonTotal(value: unknown): value is ConsultaDiariaSalespersonTotal {
  return (
    isRecord(value) &&
    typeof value.codigoVendedor === "number" &&
    Number.isInteger(value.codigoVendedor) &&
    typeof value.nomeVendedor === "string" &&
    isNonNegativeNumber(value.totalFaturado) &&
    isNonNegativeNumber(value.totalComissao) &&
    isNonNegativeNumber(value.totalDespesas) &&
    isNonNegativeNumber(value.custosTotais) &&
    isNonNegativeNumber(value.totalIcms) &&
    isNonNegativeNumber(value.totalSemNota)
  );
}

function isConsultaDiaria(value: unknown): value is ConsultaDiaria {
  return (
    isRecord(value) &&
    Array.isArray(value.topSoldItems) &&
    value.topSoldItems.every(isProduct) &&
    Array.isArray(value.topCustomers) &&
    value.topCustomers.every(isCustomer) &&
    Array.isArray(value.salesByUf) &&
    value.salesByUf.every(isState) &&
    Array.isArray(value.salespeople) &&
    value.salespeople.every(isSalesperson) &&
    Array.isArray(value.salespersonTotals) &&
    value.salespersonTotals.every(isSalespersonTotal)
  );
}

/** Fetches the management daily summary for the selected date range. */
export async function fetchConsultaDiaria(startDate: string, endDate: string): Promise<ConsultaDiaria> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const response = await apiFetch(`${API_BASE_URL}/faturamento/resumo?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Falha ao carregar o resumo gerencial (HTTP ${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!isConsultaDiaria(data)) {
    throw new Error("Formato inválido na resposta do resumo gerencial.");
  }

  return data;
}
