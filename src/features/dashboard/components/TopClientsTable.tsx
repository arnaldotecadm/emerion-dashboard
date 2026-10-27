import { useNavigate } from "react-router-dom";
import { TOP_CLIENTES, formatCurrency } from "../data/clientesData";

const MEDAL_BADGE: Record<number, string> = {
  1: "bg-yellow-400 text-white shadow-sm shadow-yellow-200",
  2: "bg-line-strong text-fg-strong",
  3: "bg-orange-300 text-white",
};

/** Ranking table of the top revenue-generating clients; rows drill into the client's detail page. */
function TopClientsTable() {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-xl shadow-card border border-line overflow-hidden h-full">
      <div className="p-6 border-b border-line flex justify-between items-center">
        <h3 className="font-bold text-fg-strong text-lg">Top Clientes por Receita</h3>
        <button className="text-accent text-sm font-semibold hover:underline">Exportar CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-canvas border-b border-line">
              <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
                Receita Mensal
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">Tendência</th>
              <th className="px-6 py-3 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {TOP_CLIENTES.map((client) => {
              const isUp = client.trendPct > 0;
              const isFlat = client.trendPct === 0;
              return (
                <tr
                  key={client.id}
                  onClick={() => navigate(`/dashboard/clientes/${client.id}`)}
                  className="hover:bg-canvas transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                        MEDAL_BADGE[client.rank] ?? "bg-surface-2 text-fg-subtle"
                      }`}
                    >
                      {client.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-ink-solid text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {client.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-fg-strong group-hover:text-accent transition-colors">
                          {client.name}
                        </p>
                        {client.vip && (
                          <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-black rounded uppercase">
                            VIP
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-fg-strong">
                    {formatCurrency(client.monthlyRevenue)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center text-sm font-medium ${
                        isFlat ? "text-fg-subtle" : isUp ? "text-emerald-600" : "text-danger-fg"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm mr-1">
                        {isFlat ? "trending_flat" : isUp ? "trending_up" : "trending_down"}
                      </span>
                      {Math.abs(client.trendPct)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="material-symbols-outlined text-base text-fg-faint group-hover:text-accent transition-colors">
                      chevron_right
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopClientsTable;
