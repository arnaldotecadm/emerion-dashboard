import { useNavigate } from "react-router-dom";
import { TOP_CLIENTES, formatCurrency } from "../data/clientesData";

const MEDAL_BADGE: Record<number, string> = {
  1: "bg-yellow-400 text-white shadow-sm shadow-yellow-200",
  2: "bg-[#c4c6cd] text-[#041627]",
  3: "bg-orange-300 text-white",
};

/** Ranking table of the top revenue-generating clients; rows drill into the client's detail page. */
function TopClientsTable() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-card border border-[#e6e8ea] overflow-hidden h-full">
      <div className="p-6 border-b border-[#e6e8ea] flex justify-between items-center">
        <h3 className="font-bold text-[#041627] text-lg">Top Clientes por Receita</h3>
        <button className="text-[#006397] text-sm font-semibold hover:underline">Exportar CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f7f9fb] border-b border-[#e6e8ea]">
              <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">
                Receita Mensal
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Tendência</th>
              <th className="px-6 py-3 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f7f9fb]">
            {TOP_CLIENTES.map((client) => {
              const isUp = client.trendPct > 0;
              const isFlat = client.trendPct === 0;
              return (
                <tr
                  key={client.id}
                  onClick={() => navigate(`/dashboard/clientes/${client.id}`)}
                  className="hover:bg-[#f7f9fb] transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                        MEDAL_BADGE[client.rank] ?? "bg-[#eceef0] text-[#8192a7]"
                      }`}
                    >
                      {client.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#041627] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {client.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#041627] group-hover:text-[#006397] transition-colors">
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
                  <td className="px-6 py-4 text-sm font-bold text-[#041627]">
                    {formatCurrency(client.monthlyRevenue)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center text-sm font-medium ${
                        isFlat ? "text-[#8192a7]" : isUp ? "text-emerald-600" : "text-[#ba1a1a]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm mr-1">
                        {isFlat ? "trending_flat" : isUp ? "trending_up" : "trending_down"}
                      </span>
                      {Math.abs(client.trendPct)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="material-symbols-outlined text-base text-[#c4c6cd] group-hover:text-[#006397] transition-colors">
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
