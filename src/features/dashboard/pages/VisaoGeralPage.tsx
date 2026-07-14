import KpiRow from "../components/KpiRow";
import SalesTrendChart from "../components/SalesTrendChart";
import RegionalBarChart from "../components/RegionalBarChart";
import RankingsPanel from "../components/RankingsPanel";
import FiscalPanel from "../components/FiscalPanel";
import CriticalAlerts from "../components/CriticalAlerts";

/** "Visão Geral" — the executive dashboard overview (KPIs, charts, rankings, alerts). */
function VisaoGeralPage() {
  return (
    <>
      <KpiRow />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SalesTrendChart />
        <RegionalBarChart />
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RankingsPanel />
        <FiscalPanel />
      </section>
      <CriticalAlerts />
    </>
  );
}

export default VisaoGeralPage;
