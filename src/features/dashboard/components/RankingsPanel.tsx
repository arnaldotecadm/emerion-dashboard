import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import type { CustomerOrderBy } from "../types/dashboardTopTrends";
import { formatCurrency } from "../utils/format";

const RANKING_ORDER_OPTIONS: { value: CustomerOrderBy; label: string }[] = [
  { value: "QUANTIDADEPEDIDO", label: "Quantidade de pedidos" },
  { value: "TOTALFATURADO", label: "Faturamento" },
];

/** Tabbed rankings card showing the top customers and salespeople from dashboard aggregates. */
function RankingsPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"sellers" | "customers">("sellers");
  const { loading, error, topVendedores, topClientes, customerOrderBy, setCustomerOrderBy } = useDashboardOverview();

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

        <div className="flex justify-end gap-2 mb-4">
          {RANKING_ORDER_OPTIONS.map(({ value: orderBy, label }) => (
              <button
                key={orderBy}
                type="button"
                aria-pressed={customerOrderBy === orderBy}
                onClick={() => setCustomerOrderBy(orderBy)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  customerOrderBy === orderBy
                    ? "bg-[#006397] text-white"
                    : "bg-[#eceef0] text-[#44474c] hover:bg-[#dfe3e6]"
                }`}
              >
                {label}
              </button>
          ))}
        </div>

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
                <th
                  className={`p-3 text-xs ${
                    customerOrderBy === "QUANTIDADEPEDIDO" ? "text-red-600 uppercase" : ""
                  }`}
                >
                  Pedidos
                </th>
                <th
                  className={`p-3 text-xs text-right rounded-r-lg ${
                    customerOrderBy === "TOTALFATURADO" ? "text-red-600 uppercase" : ""
                  }`}
                >
                  Faturamento
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {topVendedores.map((vendedor) => (
                <tr
                  key={vendedor.identifier}
                  onClick={() => navigate(`/dashboard/vendedores/${vendedor.identifier}`)}
                  className="border-b border-[#eceef0] last:border-b-0 cursor-pointer hover:bg-[#f7f9fb]"
                >
                  <td className="p-3 font-bold">{vendedor.name.trim()}</td>
                  <td className="p-3">{vendedor.amountSales.toLocaleString("pt-BR")}</td>
                  <td className="p-3 text-right">{formatCurrency(vendedor.totalSales)}</td>
                </tr>
              ))}

              {topVendedores.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-3 text-center text-[#8192a7]">
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
                <th
                  className={`p-3 text-xs ${
                    customerOrderBy === "QUANTIDADEPEDIDO" ? "text-red-600 uppercase" : ""
                  }`}
                >
                  Pedidos
                </th>
                <th
                  className={`p-3 text-xs text-right rounded-r-lg ${
                    customerOrderBy === "TOTALFATURADO" ? "text-red-600 uppercase" : ""
                  }`}
                >
                  Faturamento
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {topClientes.map((cliente) => (
                <tr
                  key={cliente.identifier}
                  onClick={() => navigate(`/dashboard/clientes/${cliente.identifier}`)}
                  className="border-b border-[#eceef0] last:border-b-0 cursor-pointer hover:bg-[#f7f9fb]"
                >
                  <td className="p-3 font-bold">{cliente.name}</td>
                  <td className="p-3">{cliente.amountSales.toLocaleString("pt-BR")}</td>
                  <td className="p-3 text-right">{formatCurrency(cliente.totalSales)}</td>
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
