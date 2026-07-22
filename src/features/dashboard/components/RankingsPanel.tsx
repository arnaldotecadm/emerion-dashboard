import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { formatCurrency } from "../utils/format";

/** Tabbed rankings card: top vendedores (by saldo) vs. top clientes (by faturamento), from real ERP data. */
function RankingsPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"sellers" | "customers">("sellers");
  const { loading, error, topVendedores, topClientes } = useDashboardOverview();

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
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
        {error && <p className="text-sm text-[#8192a7]">{error}</p>}

        {!error && loading && (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-8 bg-[#eceef0] rounded-lg w-full" />
            ))}
          </div>
        )}

        {!error && !loading && tab === "sellers" && (
          <table className="w-full text-left">
            <thead className="bg-[#eceef0]">
              <tr>
                <th className="p-3 text-xs rounded-l-lg">Vendedor</th>
                <th className="p-3 text-xs">Cidade/UF</th>
                <th className="p-3 text-xs">Saldo</th>
                <th className="p-3 text-xs text-right rounded-r-lg">Situação</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {topVendedores.map((vendedor) => (
                <tr
                  key={vendedor.id}
                  onClick={() => navigate(`/dashboard/vendedores/${vendedor.id}`)}
                  className="border-b border-[#eceef0] last:border-b-0 cursor-pointer hover:bg-[#f7f9fb]"
                >
                  <td className="p-3 font-bold">{vendedor.nome.trim()}</td>
                  <td className="p-3">
                    {vendedor.cidade ? `${vendedor.cidade}${vendedor.uf ? `/${vendedor.uf}` : ""}` : "—"}
                  </td>
                  <td className="p-3">{formatCurrency(vendedor.saldo)}</td>
                  <td className="p-3 text-right">
                    <span
                      className={
                        vendedor.situacao?.toLowerCase() === "ativo"
                          ? "text-[#18a659] bg-[#7efba4]/20 px-2 py-1 rounded text-[10px]"
                          : "text-[#44474c] bg-[#eceef0] px-2 py-1 rounded text-[10px]"
                      }
                    >
                      {vendedor.situacao ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}

              {topVendedores.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-[#8192a7]">
                    Nenhum vendedor cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {!error && !loading && tab === "customers" && (
          <table className="w-full text-left">
            <thead className="bg-[#eceef0]">
              <tr>
                <th className="p-3 text-xs rounded-l-lg">Cliente</th>
                <th className="p-3 text-xs">Pedidos</th>
                <th className="p-3 text-xs text-right rounded-r-lg">Faturamento</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {topClientes.map((cliente) => (
                <tr key={cliente.codCli} className="border-b border-[#eceef0] last:border-b-0">
                  <td className="p-3 font-bold">{cliente.nome}</td>
                  <td className="p-3">{cliente.totalPedidos}</td>
                  <td className="p-3 text-right">{formatCurrency(cliente.faturamento)}</td>
                </tr>
              ))}

              {topClientes.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-3 text-center text-[#8192a7]">
                    Nenhum pedido registrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default RankingsPanel;
