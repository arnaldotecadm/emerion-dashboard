import { useState } from "react";
import { useSellerTopTrends } from "../hooks/useSellerTopTrends";
import type { CustomerOrderBy, DashboardYears } from "../types/dashboardTopTrends";
import { formatCurrency } from "../utils/format";

const ORDER_OPTIONS: { value: CustomerOrderBy; label: string }[] = [
  { value: "QUANTIDADEPEDIDO", label: "Quantidade de Pedidos" },
  { value: "TOTALFATURADO", label: "Faturamento" },
];

const MEDAL_CLASS = ["text-yellow-500", "text-[#8192a7]", "text-orange-400"];

function getSellerInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toLocaleUpperCase("pt-BR");
}

/** Compact leaderboard of top sellers ranked by orders or billed sales. */
function TopSellersLeaderboard({ years }: { years: DashboardYears }) {
  const [orderBy, setOrderBy] = useState<CustomerOrderBy>("TOTALFATURADO");
  const { data: sellers, loading, error } = useSellerTopTrends(orderBy, years);

  return (
    <div className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6 h-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="font-bold text-[#041627]">Top Vendedores</h3>
        <div className="flex rounded-lg bg-[#eceef0] p-1" aria-label="Ordenar vendedores por">
          {ORDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={orderBy === option.value}
              onClick={() => setOrderBy(option.value)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all ${
                orderBy === option.value
                  ? "bg-white text-[#006397] shadow-sm"
                  : "text-[#44474c] hover:text-[#041627]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p role="alert" className="py-6 text-center text-sm text-[#ba1a1a]">{error}</p>}
      {!error && loading && (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-12 rounded-lg bg-[#eceef0]" />
          ))}
        </div>
      )}
      {!error && !loading && sellers.length === 0 && (
        <p className="py-6 text-center text-sm text-[#8192a7]">Nenhum vendedor encontrado.</p>
      )}
      {!error && !loading && sellers.length > 0 && (
        <div className="max-h-[260px] space-y-4 overflow-y-auto pr-2">
          {sellers.map((seller, index) => (
            <div key={seller.identifier} className="flex items-center gap-4">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#cce5ff] text-sm font-bold text-[#006397]">
                {getSellerInitials(seller.name)}
                {index < MEDAL_CLASS.length && (
                  <span
                    className={`material-symbols-outlined absolute -right-1 -top-1 text-lg ${MEDAL_CLASS[index]}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-label={`Posição ${index + 1}`}
                  >
                    military_tech
                  </span>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-sm font-bold text-[#041627]">{seller.name.trim()}</span>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-xs">
                  <span className="text-[#8192a7]">
                    {seller.amountSales.toLocaleString("pt-BR")} pedidos
                  </span>
                  <span className={`font-bold ${orderBy === "TOTALFATURADO" ? "text-[#006397]" : "text-[#44474c]"}`}>
                    {formatCurrency(seller.totalSales)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopSellersLeaderboard;
