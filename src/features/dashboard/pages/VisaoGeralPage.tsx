import KpiRow from "../components/KpiRow";
import PipelineHealthPanel from "../components/PipelineHealthPanel";
import InsightsPanel from "../components/InsightsPanel";
import SalesTrendChart from "../components/SalesTrendChart";
import RegionalBarChart from "../components/RegionalBarChart";
import RankingsPanel from "../components/RankingsPanel";
import ProductMixPanel from "../components/ProductMixPanel";
import FiscalPanel from "../components/FiscalPanel";
import CriticalAlerts from "../components/CriticalAlerts";

/** "Visão Geral" — the executive dashboard overview (KPIs, pipeline health, charts, rankings, alerts). */
function VisaoGeralPage() {
  return (
    <>
      <KpiRow />
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <PipelineHealthPanel />
        </div>
        <InsightsPanel />
      </section>
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
    </>
  );
}

export default VisaoGeralPage;
