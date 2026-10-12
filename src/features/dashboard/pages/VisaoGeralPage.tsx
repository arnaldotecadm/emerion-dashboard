import KpiRow from "../components/KpiRow";
import SalesTrendChart from "../components/SalesTrendChart";
import RegionalBarChart from "../components/RegionalBarChart";
import RankingsPanel from "../components/RankingsPanel";
import ProductMixPanel from "../components/ProductMixPanel";
import FiscalPanel from "../components/FiscalPanel";
import CriticalAlerts from "../components/CriticalAlerts";
import { DashboardOverviewProvider, useDashboardOverview } from "../hooks/useDashboardOverview";
import type { DashboardYears } from "../types/dashboardTopTrends";

const YEARS_OPTIONS: { value: DashboardYears; label: string }[] = [
  { value: 1, label: "Ano atual" },
  { value: 2, label: "Últimos 2 anos" },
  { value: null, label: "Todos" },
];

function DashboardYearsFilter() {
  const { years, setYears } = useDashboardOverview();

  return (
    <section className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h2 className="text-sm font-semibold text-[#041627]">Período dos dados</h2>
        <p className="text-xs text-[#8192a7]">Filtro aplicado a toda a visão geral</p>
      </div>
      <div className="flex bg-white rounded-lg border border-[#e6e8ea] p-1" aria-label="Filtrar dados por ano">
        {YEARS_OPTIONS.map((option) => (
          <button
            key={option.label}
            type="button"
            aria-pressed={years === option.value}
            onClick={() => setYears(option.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              years === option.value
                ? "bg-[#006397] text-white shadow-sm"
                : "text-[#44474c] hover:text-[#041627]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}

/** "Visão Geral" — the executive dashboard overview (KPIs, pipeline health, charts, rankings, alerts). */
function VisaoGeralPage() {
  return (
    <DashboardOverviewProvider>
      <DashboardYearsFilter />
      <KpiRow />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SalesTrendChart />
        <RegionalBarChart />
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RankingsPanel />
        </div>
        <div className="flex flex-col gap-6">
          <ProductMixPanel />
          <FiscalPanel />
        </div>
      </section>
      <CriticalAlerts />
    </DashboardOverviewProvider>
  );
}

export default VisaoGeralPage;
