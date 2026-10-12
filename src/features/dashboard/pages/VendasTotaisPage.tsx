import { useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency, VENDAS_DATASETS } from "../data/vendasTotaisData";
import { useCustomerOrdersOverTime } from "../hooks/useCustomerOrdersOverTime";
import SalesChannelPanel from "../components/SalesChannelPanel";
import TopSellersLeaderboard from "../components/TopSellersLeaderboard";
import GoalProgressPanel from "../components/GoalProgressPanel";

type SalesGranularity = "mes" | "trimestre";
type PeriodYearFilter = "current-year" | "last-two-years" | "all";

interface SalesPeriodPoint {
  key: string;
  label: string;
  chartLabel: string;
  previousKey: string;
  amountSold: number;
  orderCount: number;
}

interface HoveredSalesPoint {
  index: number;
}

const GRANULARITY_OPTIONS: { value: SalesGranularity; label: string }[] = [
  { value: "mes", label: "Mês" },
  { value: "trimestre", label: "Trimestre" },
];

const YEAR_FILTER_OPTIONS: { value: PeriodYearFilter; label: string }[] = [
  { value: "current-year", label: "Ano atual" },
  { value: "last-two-years", label: "Últimos 2 anos" },
  { value: "all", label: "Todos (3 anos)" },
];

function getPreviousPeriodKey(year: number, period: number, granularity: SalesGranularity): string {
  if (granularity === "mes") {
    return period === 1
      ? `${year - 1}-M12`
      : `${year}-M${String(period - 1).padStart(2, "0")}`;
  }

  return period === 1 ? `${year - 1}-T4` : `${year}-T${period - 1}`;
}

function getMonthName(month: number): string {
  return new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date(2020, month - 1, 1));
}

function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-").map(Number);
  const monthName = getMonthName(month);
  return `${year} - ${monthName[0].toLocaleUpperCase("pt-BR")}${monthName.slice(1)}`;
}

function buildSalesPeriods(
  monthlySales: { yearMonth: string; orderCount: number; amountSold: number }[],
  granularity: SalesGranularity
): SalesPeriodPoint[] {
  if (granularity === "mes") {
    return monthlySales.map(({ yearMonth, orderCount, amountSold }) => {
      const [year, month] = yearMonth.split("-").map(Number);
      return {
        key: `${year}-M${String(month).padStart(2, "0")}`,
        label: formatYearMonth(yearMonth),
        chartLabel: `${getMonthName(month).slice(0, 3)}/${String(year).slice(-2)}`,
        previousKey: getPreviousPeriodKey(year, month, granularity),
        amountSold,
        orderCount,
      };
    });
  }

  const quarterlySales = new Map<string, SalesPeriodPoint>();
  for (const { yearMonth, orderCount, amountSold } of monthlySales) {
    const [year, month] = yearMonth.split("-").map(Number);
    const quarter = Math.ceil(month / 3);
    const key = `${year}-T${quarter}`;
    const point = quarterlySales.get(key) ?? {
      key,
      label: `${year} - ${quarter}º Trimestre`,
      chartLabel: `T${quarter}/${String(year).slice(-2)}`,
      previousKey: getPreviousPeriodKey(year, quarter, granularity),
      amountSold: 0,
      orderCount: 0,
    };
    point.amountSold += amountSold;
    point.orderCount += orderCount;
    quarterlySales.set(key, point);
  }

  return [...quarterlySales.values()];
}

function getSalesChartPoint(index: number, count: number, value: number, maxValue: number): [number, number] {
  const chartWidth = 1000;
  const chartHeight = 300;
  const paddingX = 36;
  const paddingTop = 24;
  const paddingBottom = 48;
  const x = count === 1 ? chartWidth / 2 : paddingX + (index / (count - 1)) * (chartWidth - paddingX * 2);
  const y =
    chartHeight -
    paddingBottom -
    (value / maxValue) * (chartHeight - paddingTop - paddingBottom);
  return [x, y];
}

function buildSalesChartPath(points: SalesPeriodPoint[], maxValue: number): string {
  return points
    .map((point, index) => {
      const [x, y] = getSalesChartPoint(index, points.length, point.amountSold, maxValue);
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

/** Detail/drill-down page for the "Vendas Totais" KPI, with month and quarter trends. */
function VendasTotaisPage() {
  const [granularity, setGranularity] = useState<SalesGranularity>("mes");
  const [summaryYearFilter, setSummaryYearFilter] = useState<PeriodYearFilter>("current-year");
  const [tableYearFilter, setTableYearFilter] = useState<PeriodYearFilter>("current-year");
  const dataset = VENDAS_DATASETS.mes;
  const { data: salesByPeriod, loading, error } = useCustomerOrdersOverTime();
  const currentYear = new Date().getFullYear();
  const applyYearFilter = (yearFilter: PeriodYearFilter) =>
    salesByPeriod.filter((period) => {
      if (yearFilter === "all") return true;
      const year = Number(period.yearMonth.slice(0, 4));
      return yearFilter === "current-year" ? year === currentYear : year >= currentYear - 1 && year <= currentYear;
    });
  const summaryPeriods = buildSalesPeriods(applyYearFilter(summaryYearFilter), granularity);
  const tableGroupedPeriods = buildSalesPeriods(applyYearFilter(tableYearFilter), granularity);
  const tablePeriods = [...tableGroupedPeriods].reverse();
  const totalSales = summaryPeriods.reduce((total, period) => total + period.amountSold, 0);
  const bestPeriod = summaryPeriods.reduce<SalesPeriodPoint | null>(
    (best, period) => (best === null || period.amountSold > best.amountSold ? period : best),
    null
  );
  const tableBestPeriod = tableGroupedPeriods.reduce<SalesPeriodPoint | null>(
    (best, period) => (best === null || period.amountSold > best.amountSold ? period : best),
    null
  );
  const totalOrders = summaryPeriods.reduce((total, period) => total + period.orderCount, 0);
  const goalProgressPct = Math.min(100, Math.round((totalSales / dataset.targetTotal) * 100));
  const goalRemaining = Math.max(0, dataset.targetTotal - totalSales);
  const chartMaxValue = Math.max(1, ...summaryPeriods.map(({ amountSold }) => amountSold));
  const chartPath = buildSalesChartPath(summaryPeriods, chartMaxValue);
  const chartLabelInterval = Math.max(1, Math.ceil(summaryPeriods.length / 8));
  const chartAreaPath = summaryPeriods.length
    ? `${chartPath} L${getSalesChartPoint(summaryPeriods.length - 1, summaryPeriods.length, 0, chartMaxValue)[0]},252 L${getSalesChartPoint(0, summaryPeriods.length, 0, chartMaxValue)[0]},252 Z`
    : "";
  const [hoveredPoint, setHoveredPoint] = useState<HoveredSalesPoint | null>(null);

  return (
    <div>
      <Link
        to="/dashboard"
        className="text-[#44474c] hover:text-[#006397] flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Voltar para Visão Geral
      </Link>

      {/* Header card: total value, comparison badge, granularity toggle, trend chart */}
      <section className="bg-white rounded-xl p-8 shadow-card border border-[#e6e8ea] mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#8192a7] text-sm font-medium mb-1 block uppercase tracking-wider">
              Total de Vendas no Período
            </span>
            <div className="flex items-baseline gap-4 flex-wrap">
              <h3 className="text-4xl font-extrabold text-[#041627] tracking-tight">
                {loading ? "Carregando..." : error ? "Indisponível" : formatCurrency(totalSales)}
              </h3>
            </div>
            {error && <p role="alert" className="text-[#ba1a1a] text-xs mt-2">{error}</p>}
            {!error && !loading && (
              <p className="text-[#8192a7] text-xs mt-2 italic">
                {summaryYearFilter === "current-year"
                  ? `Ano ${currentYear}`
                  : summaryYearFilter === "last-two-years"
                    ? `${currentYear - 1}–${currentYear}`
                    : "Todos os anos disponíveis"}
                {" · "}
                {granularity === "mes" ? "Agrupado por mês" : "Agrupado por trimestre"}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="flex rounded-lg bg-[#eceef0] p-1" aria-label="Filtrar período dos dados de vendas">
              {YEAR_FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={summaryYearFilter === option.value}
                  onClick={() => {
                    setSummaryYearFilter(option.value);
                    setHoveredPoint(null);
                  }}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                    summaryYearFilter === option.value
                      ? "bg-white text-[#006397] shadow-sm"
                      : "text-[#44474c] hover:text-[#041627]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="bg-[#eceef0] p-1 rounded-lg flex items-center">
              {GRANULARITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={granularity === option.value}
                  onClick={() => {
                    setGranularity(option.value);
                    setHoveredPoint(null);
                  }}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                    granularity === option.value
                      ? "bg-white text-[#006397] shadow-sm"
                      : "text-[#44474c] hover:text-[#041627]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 h-[320px] w-full relative">
          {hoveredPoint && summaryPeriods[hoveredPoint.index] && (
            <div className="absolute right-2 top-2 z-10 rounded-lg bg-[#041627] px-3 py-2 text-white shadow-lg pointer-events-none">
              <p className="text-xs font-bold mb-1">{summaryPeriods[hoveredPoint.index].label}</p>
              <p className="text-[11px]">
                Vendas: {formatCurrency(summaryPeriods[hoveredPoint.index].amountSold)}
              </p>
              <p className="text-[11px]">
                Pedidos: {summaryPeriods[hoveredPoint.index].orderCount.toLocaleString("pt-BR")}
              </p>
            </div>
          )}
          {!error && !loading && summaryPeriods.length > 0 && (
            <>
              <svg
                key={granularity}
                className="w-full h-full"
                viewBox="0 0 1000 300"
                preserveAspectRatio="none"
                role="img"
                aria-label={`Vendas por ${granularity === "mes" ? "mês" : "trimestre"}`}
                onPointerLeave={() => setHoveredPoint(null)}
              >
                <defs>
                  <linearGradient id="vendasChartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#006397" stopOpacity="0.18" />
                    <stop offset="95%" stopColor="#006397" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 0.33, 0.66, 1].map((ratio) => {
                  const y = 252 - ratio * 228;
                  return (
                    <line
                      key={ratio}
                      x1="0"
                      x2="1000"
                      y1={y}
                      y2={y}
                      stroke="#e6e8ea"
                      strokeWidth="1"
                      pointerEvents="none"
                    />
                  );
                })}
                {hoveredPoint && (
                  <line
                    x1={getSalesChartPoint(hoveredPoint.index, summaryPeriods.length, 0, chartMaxValue)[0]}
                    x2={getSalesChartPoint(hoveredPoint.index, summaryPeriods.length, 0, chartMaxValue)[0]}
                    y1="24"
                    y2="252"
                    stroke="#8192a7"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                    pointerEvents="none"
                  />
                )}
                <path d={chartAreaPath} fill="url(#vendasChartGradient)" pointerEvents="none">
                  <animate attributeName="opacity" from="0" to="1" dur="0.8s" fill="freeze" />
                </path>
                <path
                  d={chartPath}
                  fill="none"
                  stroke="#006397"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={hoveredPoint ? "5" : "4"}
                  strokeDasharray="1200"
                  strokeDashoffset="1200"
                  pointerEvents="none"
                >
                  <animate attributeName="stroke-dashoffset" from="1200" to="0" dur="1.2s" fill="freeze" />
                </path>
                <path
                  d={chartPath}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="18"
                  pointerEvents="stroke"
                  onPointerMove={(event) => {
                    const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                    if (!bounds || summaryPeriods.length === 0) return;
                    const chartX = ((event.clientX - bounds.left) / bounds.width) * 1000;
                    const nearestIndex =
                      summaryPeriods.length === 1
                        ? 0
                        : Math.round(((chartX - 36) / 928) * (summaryPeriods.length - 1));
                    setHoveredPoint({
                      index: Math.max(0, Math.min(summaryPeriods.length - 1, nearestIndex)),
                    });
                  }}
                />
                {summaryPeriods.map((point, index) => {
                  const [x, y] = getSalesChartPoint(index, summaryPeriods.length, point.amountSold, chartMaxValue);
                  const active = hoveredPoint?.index === index;
                  return (
                    <circle
                      key={point.key}
                      cx={x}
                      cy={y}
                      r={active ? "7" : "4"}
                      fill="#006397"
                      stroke="white"
                      strokeWidth={active ? "3" : "1.5"}
                      tabIndex={0}
                      role="button"
                      aria-label={`${point.label}: ${formatCurrency(point.amountSold)}, ${point.orderCount} pedidos`}
                      onPointerEnter={() => setHoveredPoint({ index })}
                      onFocus={() => setHoveredPoint({ index })}
                      onBlur={() => setHoveredPoint(null)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      <title>{`${point.label}: ${formatCurrency(point.amountSold)}`}</title>
                      <animate
                        attributeName="opacity"
                        from="0"
                        to="1"
                        dur="0.3s"
                        begin={`${index * 0.04}s`}
                        fill="freeze"
                      />
                    </circle>
                  );
                })}
              </svg>
              <div className="flex justify-between mt-1 px-1 text-[11px] text-[#8192a7] font-medium tracking-tight">
                {summaryPeriods.map((point, index) => (
                  (index % chartLabelInterval === 0 || index === summaryPeriods.length - 1) && (
                    <span
                      key={point.key}
                      className={`transition-colors ${
                        hoveredPoint?.index === index ? "text-[#006397] font-bold" : ""
                      }`}
                    >
                      {point.chartLabel}
                    </span>
                  )
                ))}
              </div>
            </>
          )}
          {!error && !loading && summaryPeriods.length === 0 && (
            <p className="flex h-full items-center justify-center text-sm text-[#8192a7]">
              Nenhuma venda encontrada no período.
            </p>
          )}
          {loading && <div className="h-full animate-pulse rounded-lg bg-[#eceef0]" />}
          {error && (
            <p role="alert" className="flex h-full items-center justify-center text-sm text-[#ba1a1a]">
              Não foi possível carregar o gráfico de vendas.
            </p>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#006397] rounded-full" />
            <span className="text-xs text-[#44474c]">Vendas</span>
          </div>
        </div>
      </section>

      {/* Summary stats grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="stars"
          label={`Melhor ${granularity === "mes" ? "Mês" : "Trimestre"}`}
          value={formatCurrency(bestPeriod?.amountSold ?? 0)}
          hint={bestPeriod?.label ?? "Sem dados"}
        />
        <StatCard
          icon="analytics"
          label={`Média ${granularity === "mes" ? "Mensal" : "Trimestral"}`}
          value={formatCurrency(summaryPeriods.length ? totalSales / summaryPeriods.length : 0)}
          hint="Média do período selecionado"
        />
        <StatCard
          icon="receipt_long"
          label="Total de Transações"
          value={totalOrders.toLocaleString("pt-BR")}
          hint="Pedidos no período"
        />
        <StatCard
          icon="payments"
          label="Ticket Médio"
          value={formatCurrency(totalOrders ? totalSales / totalOrders : 0)}
          hint="Por transação única"
        />
      </section>

      {/* Channel breakdown, top sellers leaderboard and goal-vs-actual */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-4">
          <SalesChannelPanel />
        </div>
        <div className="lg:col-span-5">
          <TopSellersLeaderboard />
        </div>
        <div className="lg:col-span-3">
          <GoalProgressPanel
            progressPct={goalProgressPct}
            remainingLabel={formatCurrency(goalRemaining)}
            targetLabel={formatCurrency(dataset.targetTotal)}
          />
        </div>
      </section>

      {/* Data table */}
      <section className="bg-white rounded-xl shadow-card border border-[#e6e8ea] overflow-hidden">
        <div className="px-8 py-6 border-b border-[#e6e8ea] flex flex-wrap justify-between items-center gap-4">
          <h3 className="font-bold text-[#041627]">Detalhamento por Período</h3>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex rounded-lg bg-[#eceef0] p-1" aria-label="Filtrar tabela por ano">
              {YEAR_FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={tableYearFilter === option.value}
                  onClick={() => setTableYearFilter(option.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                    tableYearFilter === option.value
                      ? "bg-white text-[#006397] shadow-sm"
                      : "text-[#44474c] hover:text-[#041627]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Baixar detalhamento"
              className="p-2 text-[#8192a7] hover:text-[#44474c] border border-[#e6e8ea] rounded-md transition-colors"
            >
              <span className="material-symbols-outlined text-sm">download</span>
            </button>
            <button
              type="button"
              aria-label="Imprimir detalhamento"
              className="p-2 text-[#8192a7] hover:text-[#44474c] border border-[#e6e8ea] rounded-md transition-colors"
            >
              <span className="material-symbols-outlined text-sm">print</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f7f9fb]">
              <tr>
                <th className="px-8 py-4 text-[11px] font-bold text-[#8192a7] uppercase tracking-widest">
                  Data / Período
                </th>
                <th className="px-8 py-4 text-[11px] font-bold text-[#8192a7] uppercase tracking-widest">
                  Valor Vendido
                </th>
                <th className="px-8 py-4 text-[11px] font-bold text-[#8192a7] uppercase tracking-widest text-center">
                  Nº de Pedidos
                </th>
                <th className="px-8 py-4 text-[11px] font-bold text-[#8192a7] uppercase tracking-widest text-right">
                  Variação %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e8ea]">
              {tablePeriods.map((period) => {
                const previousPeriod = tableGroupedPeriods.find(({ key }) => key === period.previousKey);
                const variation =
                  previousPeriod && previousPeriod.amountSold !== 0
                    ? ((period.amountSold - previousPeriod.amountSold) / previousPeriod.amountSold) * 100
                    : null;
                const isBest = period.key === tableBestPeriod?.key;
                const isUp = variation !== null && variation > 0;
                const isFlat = variation === null || variation === 0;
                return (
                  <tr
                    key={period.key}
                    className={
                      isBest
                        ? "bg-[#006397]/5 hover:bg-[#006397]/10 transition-colors border-l-4 border-[#006397]"
                        : "hover:bg-[#f7f9fb] transition-colors"
                    }
                  >
                    <td className="px-8 py-4 font-semibold text-[#041627]">
                      {period.label}
                      {isBest && <span className="text-[#006397] font-normal"> (Pico)</span>}
                    </td>
                    <td className={`px-8 py-4 font-bold ${isBest ? "text-[#006397]" : "text-[#041627]"}`}>
                      {formatCurrency(period.amountSold)}
                    </td>
                    <td className="px-8 py-4 text-center text-[#44474c]">
                      {period.orderCount.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span
                        className={`font-bold flex items-center justify-end gap-1 ${
                          isFlat ? "text-[#8192a7] font-medium" : isUp ? "text-emerald-600" : "text-[#ba1a1a]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {isFlat ? "horizontal_rule" : isUp ? "arrow_upward" : "arrow_downward"}
                        </span>
                        {variation === null ? "—" : `${Math.abs(variation).toFixed(1)}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!loading && !error && tablePeriods.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-8 text-center text-sm text-[#8192a7]">
                    Nenhuma venda encontrada para o filtro selecionado.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={4} className="px-8 py-8 text-center text-sm text-[#8192a7]">
                    Carregando detalhamento...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={4} className="px-8 py-8 text-center text-sm text-[#ba1a1a]">
                    Não foi possível carregar o detalhamento por período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-[#f7f9fb] border-t border-[#e6e8ea]">
          <p className="text-xs text-[#8192a7]">
            {loading
              ? "Carregando dados..."
              : `Exibindo ${tablePeriods.length} períodos agrupados por ${
                  granularity === "mes" ? "mês" : "trimestre"
                }, do mais recente ao mais antigo.`}
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, hint }: { icon: string; label: string; value: string; hint: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-card border border-[#e6e8ea] flex items-start gap-4 hover:border-[#c4c6cd] transition-all group">
      <div className="w-12 h-12 bg-[#006397]/10 rounded-lg flex items-center justify-center text-[#006397] group-hover:bg-[#006397] group-hover:text-white transition-colors shrink-0">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">{label}</p>
        <h4 className="text-xl font-bold text-[#041627]">{value}</h4>
        <p className="text-[10px] text-[#8192a7] mt-1">{hint}</p>
      </div>
    </div>
  );
}

export default VendasTotaisPage;
