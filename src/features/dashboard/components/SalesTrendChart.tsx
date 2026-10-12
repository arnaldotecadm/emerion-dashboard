import { useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import type { DashboardTrendByMonth } from "../types/dashboardTopTrends";

type TrendPeriod = "month" | "quarter";

interface TrendPoint {
  key: string;
  label: string;
  orders: number;
  quotations: number;
}

interface HoveredTrend {
  index: number;
  series: "orders" | "quotations";
}

const CHART_WIDTH = 600;
const CHART_HEIGHT = 220;
const CHART_PADDING_X = 20;
const CHART_PADDING_TOP = 16;
const CHART_PADDING_BOTTOM = 38;

function buildTrendPoints(
  orders: DashboardTrendByMonth[],
  quotations: DashboardTrendByMonth[],
  period: TrendPeriod
): TrendPoint[] {
  const monthlyData = new Map<string, { orders: number; quotations: number }>();

  for (const order of orders) {
    const point = monthlyData.get(order.yearMonth) ?? { orders: 0, quotations: 0 };
    point.orders += order.count;
    monthlyData.set(order.yearMonth, point);
  }

  for (const quotation of quotations) {
    const point = monthlyData.get(quotation.yearMonth) ?? { orders: 0, quotations: 0 };
    point.quotations += quotation.count;
    monthlyData.set(quotation.yearMonth, point);
  }

  const sortedMonths = [...monthlyData.entries()].sort(([monthA], [monthB]) =>
    monthA.localeCompare(monthB)
  );

  if (period === "month") {
    return sortedMonths.map(([yearMonth, values]) => {
      const [year, month] = yearMonth.split("-");
      const monthLabel = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"][
        Number(month) - 1
      ];

      return {
        key: yearMonth,
        label: `${monthLabel}/${year.slice(-2)}`,
        ...values,
      };
    });
  }

  const quarterlyData = new Map<string, TrendPoint>();

  for (const [yearMonth, values] of sortedMonths) {
    const [year, month] = yearMonth.split("-").map(Number);
    const quarter = Math.ceil(month / 3);
    const key = `${year}-T${quarter}`;
    const point = quarterlyData.get(key) ?? {
      key,
      label: `${quarter}º TRI/${String(year).slice(-2)}`,
      orders: 0,
      quotations: 0,
    };
    point.orders += values.orders;
    point.quotations += values.quotations;
    quarterlyData.set(key, point);
  }

  return [...quarterlyData.values()];
}

function getChartPoint(index: number, count: number, value: number, maxValue: number): [number, number] {
  const plotWidth = CHART_WIDTH - CHART_PADDING_X * 2;
  const plotHeight = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;
  const x = count === 1 ? CHART_WIDTH / 2 : CHART_PADDING_X + (index / (count - 1)) * plotWidth;
  const y = CHART_HEIGHT - CHART_PADDING_BOTTOM - (value / maxValue) * plotHeight;

  return [x, y];
}

function buildLinePath(values: number[], maxValue: number): string {
  return values
    .map((value, index) => {
      const [x, y] = getChartPoint(index, values.length, value, maxValue);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

/** Line chart card showing monthly or quarterly order and quotation counts. */
function SalesTrendChart() {
  const { loading, error, customerOrders, customerQuotations } = useDashboardOverview();
  const [period, setPeriod] = useState<TrendPeriod>("month");
  const [hoveredTrend, setHoveredTrend] = useState<HoveredTrend | null>(null);
  const points = useMemo(
    () => buildTrendPoints(customerOrders, customerQuotations, period),
    [customerOrders, customerQuotations, period]
  );
  const maxValue = Math.max(1, ...points.flatMap(({ orders, quotations }) => [orders, quotations]));
  const labelInterval = Math.max(1, Math.ceil(points.length / 6));
  const orderPath = buildLinePath(points.map(({ orders }) => orders), maxValue);
  const quotationPath = buildLinePath(points.map(({ quotations }) => quotations), maxValue);
  const hoveredPoint = hoveredTrend ? points[hoveredTrend.index] : undefined;

  function handleLinePointerMove(event: ReactPointerEvent<SVGPathElement>, series: HoveredTrend["series"]) {
    const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!bounds || points.length === 0) return;

    const chartX = ((event.clientX - bounds.left) / bounds.width) * CHART_WIDTH;
    const plotWidth = CHART_WIDTH - CHART_PADDING_X * 2;
    const nearestIndex =
      points.length === 1
        ? 0
        : Math.round(((chartX - CHART_PADDING_X) / plotWidth) * (points.length - 1));

    setHoveredTrend({
      index: Math.max(0, Math.min(points.length - 1, nearestIndex)),
      series,
    });
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-card flex flex-col h-[400px]">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
        <h3 className="text-xl font-semibold text-[#041627]">Tendência de Vendas e Orçamentos</h3>
        <div className="flex bg-[#eceef0] rounded-lg p-1" aria-label="Agrupar tendência por período">
          <button
            type="button"
            aria-pressed={period === "month"}
            onClick={() => setPeriod("month")}
            className={`px-3 py-1 rounded text-xs font-semibold ${
              period === "month" ? "bg-white shadow-sm text-[#041627]" : "text-[#44474c]"
            }`}
          >
            Mês
          </button>
          <button
            type="button"
            aria-pressed={period === "quarter"}
            onClick={() => setPeriod("quarter")}
            className={`px-3 py-1 rounded text-xs font-semibold ${
              period === "quarter" ? "bg-white shadow-sm text-[#041627]" : "text-[#44474c]"
            }`}
          >
            Trimestre
          </button>
        </div>
      </div>
      <p className="text-xs text-[#8192a7] mb-3">Quantidade de pedidos e orçamentos por período</p>

      {error && <p className="flex-1 flex items-center justify-center text-sm text-[#ba1a1a]">{error}</p>}

      {!error && loading && (
        <div className="flex-1 flex items-center animate-pulse">
          <div className="w-full h-48 bg-[#eceef0] rounded-lg" />
        </div>
      )}

      {!error && !loading && points.length === 0 && (
        <p className="flex-1 flex items-center justify-center text-sm text-[#8192a7]">
          Nenhum dado de vendas ou orçamentos no período.
        </p>
      )}

      {!error && !loading && points.length > 0 && (
        <div className="relative flex-1 min-h-0">
          {hoveredPoint && hoveredTrend && (
            <div className="absolute right-2 top-2 z-10 rounded-lg bg-[#041627] px-3 py-2 text-white shadow-lg pointer-events-none">
              <p className="text-xs font-bold mb-1">{hoveredPoint.label}</p>
              <p className="text-[11px]">
                <span className="text-[#92ccff]">Pedidos:</span>{" "}
                {hoveredPoint.orders.toLocaleString("pt-BR")}
              </p>
              <p className="text-[11px]">
                <span className="text-[#c4c6cd]">Orçamentos:</span>{" "}
                {hoveredPoint.quotations.toLocaleString("pt-BR")}
              </p>
            </div>
          )}
          <svg
            className="w-full h-full min-h-48"
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={`Quantidade de pedidos e orçamentos agrupada por ${period === "month" ? "mês" : "trimestre"}`}
            onPointerLeave={() => setHoveredTrend(null)}
          >
            {[0, 0.5, 1].map((ratio) => {
              const y =
                CHART_HEIGHT -
                CHART_PADDING_BOTTOM -
                ratio * (CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM);
              return (
                <line
                  key={ratio}
                  x1={CHART_PADDING_X}
                  x2={CHART_WIDTH - CHART_PADDING_X}
                  y1={y}
                  y2={y}
                  stroke="#e6e8ea"
                  strokeWidth="1"
                />
              );
            })}
            {hoveredTrend && (
              <line
                x1={getChartPoint(hoveredTrend.index, points.length, 0, maxValue)[0]}
                x2={getChartPoint(hoveredTrend.index, points.length, 0, maxValue)[0]}
                y1={CHART_PADDING_TOP}
                y2={CHART_HEIGHT - CHART_PADDING_BOTTOM}
                stroke="#8192a7"
                strokeDasharray="3 4"
                strokeWidth="1"
                pointerEvents="none"
              />
            )}
            <path
              d={orderPath}
              fill="none"
              stroke="#006397"
              strokeWidth={hoveredTrend?.series === "orders" ? "4" : "3"}
              opacity={hoveredTrend && hoveredTrend.series !== "orders" ? 0.35 : 1}
              vectorEffect="non-scaling-stroke"
              pointerEvents="none"
            />
            <path
              d={quotationPath}
              fill="none"
              stroke="#8192a7"
              strokeWidth={hoveredTrend?.series === "quotations" ? "3.5" : "2"}
              strokeDasharray="5 4"
              opacity={hoveredTrend && hoveredTrend.series !== "quotations" ? 0.35 : 1}
              vectorEffect="non-scaling-stroke"
              pointerEvents="none"
            />
            <path
              d={orderPath}
              fill="none"
              stroke="transparent"
              strokeWidth="16"
              pointerEvents="stroke"
              onPointerMove={(event) => handleLinePointerMove(event, "orders")}
            />
            <path
              d={quotationPath}
              fill="none"
              stroke="transparent"
              strokeWidth="16"
              pointerEvents="stroke"
              onPointerMove={(event) => handleLinePointerMove(event, "quotations")}
            />
            {points.map((point, index) => {
              const [orderX, orderY] = getChartPoint(index, points.length, point.orders, maxValue);
              const [quotationX, quotationY] = getChartPoint(index, points.length, point.quotations, maxValue);
              const isLabelVisible = index % labelInterval === 0 || index === points.length - 1;

              return (
                <g key={point.key}>
                  <circle
                    cx={orderX}
                    cy={orderY}
                    r={hoveredTrend?.index === index && hoveredTrend.series === "orders" ? "6" : "3"}
                    fill="#006397"
                    stroke="white"
                    strokeWidth={hoveredTrend?.index === index && hoveredTrend.series === "orders" ? "2" : "0"}
                    tabIndex={0}
                    role="button"
                    aria-label={`${point.label}: ${point.orders.toLocaleString("pt-BR")} pedidos`}
                    onPointerEnter={() => setHoveredTrend({ index, series: "orders" })}
                    onFocus={() => setHoveredTrend({ index, series: "orders" })}
                    onBlur={() => setHoveredTrend(null)}
                    className="cursor-pointer"
                  >
                    <title>{`${point.label}: ${point.orders.toLocaleString("pt-BR")} pedidos`}</title>
                  </circle>
                  <circle
                    cx={quotationX}
                    cy={quotationY}
                    r={hoveredTrend?.index === index && hoveredTrend.series === "quotations" ? "6" : "3"}
                    fill="#8192a7"
                    stroke="white"
                    strokeWidth={
                      hoveredTrend?.index === index && hoveredTrend.series === "quotations" ? "2" : "0"
                    }
                    tabIndex={0}
                    role="button"
                    aria-label={`${point.label}: ${point.quotations.toLocaleString("pt-BR")} orçamentos`}
                    onPointerEnter={() => setHoveredTrend({ index, series: "quotations" })}
                    onFocus={() => setHoveredTrend({ index, series: "quotations" })}
                    onBlur={() => setHoveredTrend(null)}
                    className="cursor-pointer"
                  >
                    <title>{`${point.label}: ${point.quotations.toLocaleString("pt-BR")} orçamentos`}</title>
                  </circle>
                  {isLabelVisible && (
                    <text
                      x={orderX}
                      y={CHART_HEIGHT - 10}
                      textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}
                      fill="#44474c"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {point.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      <div className="flex w-fit self-start gap-3 mt-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#006397] rounded-full" />
          <span className="text-[10px]">Pedidos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#8192a7] rounded-full border border-dashed border-white" />
          <span className="text-[10px]">Orçamentos</span>
        </div>
      </div>
    </div>
  );
}

export default SalesTrendChart;
