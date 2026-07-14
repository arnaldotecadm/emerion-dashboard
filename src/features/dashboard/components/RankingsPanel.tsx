import { useState } from "react";

interface SellerRow {
  name: string;
  region: string;
  revenue: string;
  goalPct: number;
}

const TOP_SELLERS: SellerRow[] = [
  { name: "Carlos Eduardo S.", region: "SP - Capital", revenue: "R$ 840k", goalPct: 105 },
  { name: "Mariana Oliveira", region: "PR - Curitiba", revenue: "R$ 720k", goalPct: 98 },
  { name: "Roberto J. Lima", region: "MG - Belo Horiz.", revenue: "R$ 610k", goalPct: 85 },
];

const TOP_CUSTOMERS: SellerRow[] = [
  { name: "Distribuidora Alfa Ltda.", region: "SP - Capital", revenue: "R$ 1.1M", goalPct: 100 },
  { name: "Comercial Beta S.A.", region: "RS - Porto Alegre", revenue: "R$ 640k", goalPct: 92 },
  { name: "Grupo Gamma", region: "MG - Uberlândia", revenue: "R$ 480k", goalPct: 78 },
];

/** Tabbed rankings card: top sellers vs. top customers. */
function RankingsPanel() {
  const [tab, setTab] = useState<"sellers" | "customers">("sellers");
  const rows = tab === "sellers" ? TOP_SELLERS : TOP_CUSTOMERS;

  return (
    <div className="bg-white rounded-xl shadow-[0px_4px_12px_rgba(26,43,60,0.05)] overflow-hidden">
      <div className="flex border-b border-[#e6e8ea]">
        <button
          onClick={() => setTab("sellers")}
          className={
            tab === "sellers"
              ? "flex-1 py-4 text-xs font-bold border-b-2 border-[#006397] text-[#006397]"
              : "flex-1 py-4 text-xs font-bold text-[#44474c] hover:bg-[#f7f9fb]"
          }
        >
          TOP VENDEDORES
        </button>
        <button
          onClick={() => setTab("customers")}
          className={
            tab === "customers"
              ? "flex-1 py-4 text-xs font-bold border-b-2 border-[#006397] text-[#006397]"
              : "flex-1 py-4 text-xs font-bold text-[#44474c] hover:bg-[#f7f9fb]"
          }
        >
          TOP CLIENTES
        </button>
      </div>
      <div className="p-6">
        <table className="w-full text-left">
          <thead className="bg-[#eceef0]">
            <tr>
              <th className="p-3 text-xs rounded-l-lg">{tab === "sellers" ? "Vendedor" : "Cliente"}</th>
              <th className="p-3 text-xs">Regional</th>
              <th className="p-3 text-xs">Faturamento</th>
              <th className="p-3 text-xs text-right rounded-r-lg">Progresso</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {rows.map((row) => (
              <tr key={row.name} className="border-b border-[#eceef0] last:border-b-0">
                <td className="p-3 font-bold">{row.name}</td>
                <td className="p-3">{row.region}</td>
                <td className="p-3">{row.revenue}</td>
                <td className="p-3 text-right">
                  <span
                    className={
                      row.goalPct >= 100
                        ? "text-[#18a659] bg-[#7efba4]/20 px-2 py-1 rounded text-[10px]"
                        : "text-[#44474c] bg-[#eceef0] px-2 py-1 rounded text-[10px]"
                    }
                  >
                    {row.goalPct}% META
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RankingsPanel;
