import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../data/clientesData";
import type { DashboardTopTrend } from "../types/dashboardTopTrends";

const MEDAL_BADGE: Record<number, string> = {
  1: "bg-yellow-400 text-white shadow-sm shadow-yellow-200",
  2: "bg-line-strong text-fg-strong",
  3: "bg-orange-300 text-white",
};

/** Ranking table of the top revenue-generating clients; rows drill into the client's detail page. */
interface TopClientsTableProps {
  data: DashboardTopTrend[];
  loading: boolean;
  error: string | null;
}

function TopClientsTable({ data, loading, error }: TopClientsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-xl shadow-card border border-line overflow-hidden h-full">
      <div className="p-6 border-b border-line flex justify-between items-center">
        <h3 className="font-bold text-fg-strong text-lg">Top Clientes por Receita</h3>
        <button className="text-accent text-sm font-semibold hover:underline">Exportar CSV</button>
      </div>
      <div className="max-h-[360px] overflow-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 z-10 bg-canvas">
            <tr className="border-b border-line">
              <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
                Receita Total
              </th>
              <th className="px-6 py-3 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {data.map((client, index) => (
              <tr
                key={client.identifier}
                onClick={() => navigate(`/dashboard/clientes/${client.identifier}`)}
                className="hover:bg-canvas transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4">
                  <span
                    className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                      MEDAL_BADGE[index + 1] ?? "bg-surface-2 text-fg-subtle"
                    }`}
                  >
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-ink-solid text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {client.name.slice(0, 2).toLocaleUpperCase("pt-BR")}
                    </div>
                    <p className="text-sm font-bold text-fg-strong group-hover:text-accent transition-colors">
                      {client.name.trim() || `Cliente ${client.identifier}`}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-fg-strong">{formatCurrency(client.totalSales)}</td>
                <td className="px-6 py-4 text-right">
                  <span className="material-symbols-outlined text-base text-fg-faint group-hover:text-accent transition-colors">
                    chevron_right
                  </span>
                </td>
              </tr>
            ))}
            {!loading && !error && data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-fg-subtle">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
            {(loading || error) && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-fg-subtle">
                  {loading ? "Carregando ranking..." : error}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopClientsTable;
