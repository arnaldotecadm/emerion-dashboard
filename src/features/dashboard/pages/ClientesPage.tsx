import { Link } from "react-router-dom";
import { CLIENTES_KPIS } from "../data/clientesData";
import TopClientsTable from "../components/TopClientsTable";
import DelinquencyRiskPanel from "../components/DelinquencyRiskPanel";
import ClientRegionPanel from "../components/ClientRegionPanel";
import CreditUtilizationPanel from "../components/CreditUtilizationPanel";
import ClientGrowthPanel from "../components/ClientGrowthPanel";
import ClientsDirectoryTable from "../components/ClientsDirectoryTable";

/** "Clientes" — customer directory, credit health and account risk overview for managers. */
function ClientesPage() {
  return (
    <div>
      <Link
        to="/dashboard"
        className="text-[#44474c] hover:text-[#006397] flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Voltar para Visão Geral
      </Link>

      {/* Page intro: title + quick actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#041627] tracking-tight">Clientes</h2>
          <p className="text-[#8192a7] mt-1">Gerencie sua base de clientes e monitore a saúde da receita.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-[#e6e8ea] text-[#44474c] font-semibold rounded-xl hover:bg-[#f7f9fb] transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filtros Avançados
          </button>
        </div>
      </div>

      {/* KPI row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {CLIENTES_KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white p-6 rounded-xl shadow-card border border-[#e6e8ea] flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  kpi.danger ? "bg-[#ffdad6] text-[#ba1a1a]" : "bg-[#006397]/10 text-[#006397]"
                }`}
              >
                <span className="material-symbols-outlined text-2xl">{kpi.icon}</span>
              </div>
              {kpi.trend && (
                <span
                  className={`px-2 py-1 text-xs font-bold rounded-md flex items-center ${
                    kpi.trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-[#ffdad6] text-[#93000a]"
                  }`}
                >
                  <span className="material-symbols-outlined text-xs mr-1">
                    {kpi.trend.positive ? "trending_up" : "trending_down"}
                  </span>
                  {kpi.trend.label}
                </span>
              )}
              {kpi.danger && !kpi.trend && (
                <span className="text-[#ba1a1a] font-bold text-xs uppercase tracking-tighter">Crítico</span>
              )}
            </div>
            <h3 className="text-[#8192a7] font-medium text-sm">{kpi.label}</h3>
            <p className={`text-2xl font-bold mt-1 ${kpi.danger ? "text-[#ba1a1a]" : "text-[#041627]"}`}>
              {kpi.value}
            </p>
            <p className="text-xs text-[#8192a7] mt-2">{kpi.hint}</p>
            {kpi.progress !== undefined && (
              <div className="w-full bg-[#eceef0] h-2 rounded-full mt-3">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: `${kpi.progress}%` }} />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Top clients + delinquency risk */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8">
          <TopClientsTable />
        </div>
        <div className="lg:col-span-4">
          <DelinquencyRiskPanel />
        </div>
      </section>

      {/* Region distribution, credit usage, growth */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ClientRegionPanel />
        <CreditUtilizationPanel />
        <ClientGrowthPanel />
      </section>

      {/* Full client directory */}
      <ClientsDirectoryTable />
    </div>
  );
}

export default ClientesPage;
