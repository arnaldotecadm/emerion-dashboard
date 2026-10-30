import { Link } from "react-router-dom";
import { CLIENTES_KPIS, formatCurrency } from "../data/clientesData";
import { useCustomerTopTrends } from "../hooks/useCustomerTopTrends";
import TopClientsTable from "../components/TopClientsTable";
import DelinquencyRiskPanel from "../components/DelinquencyRiskPanel";
import ClientRegionPanel from "../components/ClientRegionPanel";
import CreditUtilizationPanel from "../components/CreditUtilizationPanel";
import ClientGrowthPanel from "../components/ClientGrowthPanel";
import ClientsDirectoryTable from "../components/ClientsDirectoryTable";
import UnavailableDataNotice from "../components/UnavailableDataNotice";
import type { DashboardYears } from "../types/dashboardTopTrends";

const YEARS_OPTIONS: { value: DashboardYears; label: string }[] = [
  { value: 1, label: "Ano atual" },
  { value: 2, label: "Últimos 2 anos" },
  { value: null, label: "Todos" },
];

/** "Clientes" — customer directory, credit health and account risk overview for managers. */
function ClientesPage() {
  const { data, loading, error, years, setYears } = useCustomerTopTrends();
  const kpis = CLIENTES_KPIS.map((kpi) => {
    if (kpi.label === "Clientes Ativos") {
      return {
        ...kpi,
        value: loading ? "Carregando..." : error ? "—" : (data?.activeCustomers.toLocaleString("pt-BR") ?? "—"),
        hint: error ? "Não foi possível carregar este indicador." : "Total de clientes ativos",
        trend: undefined,
      };
    }

    if (kpi.label === "Ticket Médio Mensal") {
      return {
        ...kpi,
        value: loading
          ? "Carregando..."
          : error
            ? "—"
            : data
              ? formatCurrency(data.monthlyAverageTicket)
              : "—",
        hint: error ? "Não foi possível carregar este indicador." : "Ticket médio mensal",
        trend: undefined,
      };
    }

    if (kpi.label === "Inadimplência") {
      return {
        ...kpi,
        value: loading
          ? "Carregando..."
          : error
            ? "—"
            : data
              ? formatCurrency(data.unpaidInvoicesAmount)
              : "—",
        hint: error ? "Não foi possível carregar este indicador." : "Valor total de faturas não pagas",
      };
    }

    return kpi;
  });

  return (
    <div>
      <Link
        to="/dashboard"
        className="text-fg-muted hover:text-accent flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Voltar para Visão Geral
      </Link>

      {/* Page intro: title + quick actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-fg-strong tracking-tight">Clientes</h2>
          <p className="text-fg-subtle mt-1">Gerencie sua base de clientes e monitore a saúde da receita.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-card border border-line text-fg-muted font-semibold rounded-xl hover:bg-canvas transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filtros Avançados
          </button>
        </div>
      </div>

      <section className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-fg-strong">Período dos dados</h3>
          <p className="text-xs text-fg-subtle">Filtro aplicado aos indicadores de clientes</p>
        </div>
        <div className="flex bg-card rounded-lg border border-line p-1" aria-label="Filtrar dados por ano">
          {YEARS_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={years === option.value}
              onClick={() => setYears(option.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                years === option.value
                  ? "bg-accent-solid text-white shadow-sm"
                  : "text-fg-muted hover:text-fg-strong"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {/* KPI row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-card p-6 rounded-xl shadow-card border border-line flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  kpi.danger ? "bg-danger-soft text-danger-fg" : "bg-accent-solid/10 text-accent"
                }`}
              >
                <span className="material-symbols-outlined text-2xl">{kpi.icon}</span>
              </div>
              {kpi.trend && (
                <span
                  className={`px-2 py-1 text-xs font-bold rounded-md flex items-center ${
                    kpi.trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-danger-soft text-danger-ink"
                  }`}
                >
                  <span className="material-symbols-outlined text-xs mr-1">
                    {kpi.trend.positive ? "trending_up" : "trending_down"}
                  </span>
                  {kpi.trend.label}
                </span>
              )}
              {kpi.danger && !kpi.trend && (
                <span className="text-danger-fg font-bold text-xs uppercase tracking-tighter">Crítico</span>
              )}
            </div>
            <h3 className="text-fg-subtle font-medium text-sm">{kpi.label}</h3>
            {kpi.label === "Limite de Crédito Total" ? (
              <div className="mt-3">
                <UnavailableDataNotice
                  compact
                  icon="credit_card"
                  description="Este indicador poderá ser preenchido se houver interesse em acompanhar os limites."
                />
              </div>
            ) : (
              <>
                <p className={`text-2xl font-bold mt-1 ${kpi.danger ? "text-danger-fg" : "text-fg-strong"}`}>
                  {kpi.value}
                </p>
                <p className="text-xs text-fg-subtle mt-2">{kpi.hint}</p>
                {kpi.progress !== undefined && (
                  <div className="w-full bg-surface-2 h-2 rounded-full mt-3">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${kpi.progress}%` }} />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </section>

      {/* Top clients + delinquency risk */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8">
          <TopClientsTable data={data?.mostProfitableCustomers ?? []} loading={loading} error={error} />
        </div>
        <div className="lg:col-span-4">
          <DelinquencyRiskPanel data={data?.overdueInvoices ?? []} loading={loading} error={error} />
        </div>
      </section>

      {/* Region distribution, credit usage, growth */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ClientRegionPanel data={data?.customerDistributionByRegion ?? []} loading={loading} error={error} />
        <CreditUtilizationPanel />
        <ClientGrowthPanel data={data?.newCustomersByMonth ?? []} loading={loading} error={error} />
      </section>

      {/* Full client directory */}
      <ClientsDirectoryTable />
    </div>
  );
}

export default ClientesPage;
