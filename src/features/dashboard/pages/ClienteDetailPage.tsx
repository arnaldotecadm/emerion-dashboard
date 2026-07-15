import { Link, useParams } from "react-router-dom";
import { formatCurrency, getClienteById, riskLevelFor } from "../data/clientesData";
import PlaceholderPage from "../components/PlaceholderPage";

const STATUS_STYLES: Record<string, string> = {
  Ativo: "bg-emerald-100 text-emerald-700",
  Risco: "bg-[#ffdad6] text-[#93000a]",
  Inativo: "bg-[#eceef0] text-[#8192a7]",
};

const ORDER_STATUS_STYLES: Record<string, string> = {
  Faturado: "bg-emerald-100 text-emerald-700",
  Pendente: "bg-orange-100 text-orange-700",
  Cancelado: "bg-[#ffdad6] text-[#93000a]",
};

/** Read-only detail view for a single client, reached by clicking their row/card anywhere in "Clientes". */
function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const cliente = id ? getClienteById(id) : undefined;

  if (!cliente) {
    return (
      <div>
        <Link
          to="/dashboard/clientes"
          className="text-[#44474c] hover:text-[#006397] flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Voltar para Clientes
        </Link>
        <PlaceholderPage
          icon="person_search"
          title="Cliente não encontrado"
          description="Não foi possível localizar este cliente. Volte para a lista de clientes e tente novamente."
        />
      </div>
    );
  }

  const availableCredit = cliente.creditLimit * (1 - cliente.utilizedPct / 100);
  const isUp = cliente.trendPct > 0;
  const isFlat = cliente.trendPct === 0;
  const riskLevel = cliente.daysOverdue !== undefined ? riskLevelFor(cliente.daysOverdue) : undefined;

  return (
    <div>
      <Link
        to="/dashboard/clientes"
        className="text-[#44474c] hover:text-[#006397] flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Voltar para Clientes
      </Link>

      {/* Header card: identity, status, city */}
      <section className="bg-white rounded-xl p-8 shadow-card border border-[#e6e8ea] mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#041627] text-white flex items-center justify-center font-bold text-xl shrink-0">
              {cliente.initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-[#041627] tracking-tight">{cliente.name}</h2>
                {cliente.vip && (
                  <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-black rounded uppercase">
                    VIP
                  </span>
                )}
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-full ${STATUS_STYLES[cliente.status]}`}
                >
                  {cliente.status}
                </span>
              </div>
              <p className="text-[#8192a7] text-sm mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {cliente.city}
              </p>
            </div>
          </div>
        </div>
      </section>

      {riskLevel && (
        <section
          className={`p-5 rounded-xl border mb-8 flex items-center gap-4 ${
            riskLevel === "Alto" ? "bg-[#ffdad6] border-[#ffb4ab]" : "bg-orange-50 border-orange-100"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              riskLevel === "Alto" ? "bg-[#ba1a1a] text-white" : "bg-orange-500 text-white"
            }`}
          >
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <h4 className={`text-sm font-bold ${riskLevel === "Alto" ? "text-[#93000a]" : "text-orange-700"}`}>
              Risco de inadimplência — {riskLevel}
            </h4>
            <p className={`text-xs ${riskLevel === "Alto" ? "text-[#93000a]" : "text-orange-700"}`}>
              Fatura vencida há {cliente.daysOverdue} dias. Recomenda-se contato imediato antes de novos pedidos.
            </p>
          </div>
        </section>
      )}

      {/* Stat cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-card border border-[#e6e8ea]">
          <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Receita Mensal</p>
          <h4 className="text-2xl font-bold text-[#041627]">{formatCurrency(cliente.monthlyRevenue)}</h4>
          <span
            className={`flex items-center gap-1 mt-2 text-xs font-semibold ${
              isFlat ? "text-[#8192a7]" : isUp ? "text-emerald-600" : "text-[#ba1a1a]"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {isFlat ? "trending_flat" : isUp ? "trending_up" : "trending_down"}
            </span>
            {Math.abs(cliente.trendPct)}% vs. mês anterior
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card border border-[#e6e8ea]">
          <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Limite de Crédito</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-bold text-[#041627]">{cliente.utilizedPct}%</h4>
            <p className="text-xs text-[#8192a7]">
              {formatCurrency((cliente.creditLimit * cliente.utilizedPct) / 100)} / {formatCurrency(cliente.creditLimit)}
            </p>
          </div>
          <div className="w-full bg-[#eceef0] h-2 rounded-full mt-3">
            <div
              className={`h-full rounded-full ${
                cliente.utilizedPct >= 95 ? "bg-[#ba1a1a]" : cliente.utilizedPct >= 85 ? "bg-orange-500" : "bg-[#006397]"
              }`}
              style={{ width: `${cliente.utilizedPct}%` }}
            />
          </div>
          <p className="text-[10px] text-[#8192a7] mt-2">
            Disponível: {formatCurrency(availableCredit)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card border border-[#e6e8ea]">
          <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">Última Compra</p>
          <h4 className="text-2xl font-bold text-[#041627]">{cliente.lastPurchase}</h4>
          <p className="text-xs text-[#8192a7] mt-2">Data do pedido mais recente registrado</p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-card border border-[#e6e8ea] overflow-hidden">
          <div className="p-6 border-b border-[#e6e8ea]">
            <h3 className="font-bold text-[#041627] text-lg">Pedidos Recentes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f7f9fb] border-b border-[#e6e8ea]">
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f7f9fb]">
                {(cliente.recentOrders ?? []).map((order) => (
                  <tr key={order.date} className="hover:bg-[#f7f9fb] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#44474c]">{order.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#041627]">{formatCurrency(order.value)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full ${ORDER_STATUS_STYLES[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact card */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6">
          <h3 className="font-bold text-[#041627] text-lg mb-4">Contato Principal</h3>
          {cliente.contact ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#006397]">person</span>
                <span className="text-sm text-[#041627] font-medium">{cliente.contact.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#006397]">mail</span>
                <span className="text-sm text-[#44474c] break-all">{cliente.contact.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#006397]">call</span>
                <span className="text-sm text-[#44474c]">{cliente.contact.phone}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#8192a7]">Nenhum contato cadastrado.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ClienteDetailPage;
