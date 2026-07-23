/** Formats a CPF (11 digits) or CNPJ (14 digits) string with standard punctuation. */
export function formatCpfCnpj(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return value;
}

/** Formats a numeric value as Brazilian Real currency (e.g. `R$ 1.234,56`). */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Formats a decimal aliquot/percentage value (e.g. `18` → `18%`). */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;
}

/** Formats an ISO date-time string as a short `dd/mm/aaaa` date, for display in tables. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR");
}

/** Derives a 1-2 letter avatar initial from a company/trade name. */
export function initialsFrom(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
