import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import type { DashboardTrendByMonth } from "../types/dashboardTopTrends";

type TrendPeriod = "month" | "quarter";

interface TrendPoint {
  key: string;
  label: string;
  orders: number;
  quotations: number;
}

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

/** Line chart card showing monthly or quarterly order and quotation counts. */
function SalesTrendChart() {
  const { loading, error, customerOrders, customerQuotations } = useDashboardOverview();
  const [period, setPeriod] = useState<TrendPeriod>("month");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredSeries, setHoveredSeries] = useState<"orders" | "quotations" | null>(null);
  const points = useMemo(
    () => buildTrendPoints(customerOrders, customerQuotations, period),
    [customerOrders, customerQuotations, period]
  );
  const labelInterval = Math.max(1, Math.ceil(points.length / 6));

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
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={points}
              margin={{ top: 16, right: 12, bottom: 8, left: 8 }}
              accessibilityLayer
              aria-label={`Quantidade de pedidos e orçamentos agrupada por ${period === "month" ? "mês" : "trimestre"}`}
              onMouseMove={(state) => {
                const index = state?.activeTooltipIndex;
                setHoveredIndex(typeof index === "number" ? index : null);
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CartesianGrid vertical={false} stroke="#e6e8ea" />
              <XAxis
                dataKey="label"
                interval={labelInterval - 1}
                tick={{ fill: "#44474c", fontSize: 11, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide domain={[0, "auto"]} />
              {hoveredIndex !== null && points[hoveredIndex] && (
                <ReferenceLine
                  x={points[hoveredIndex].label}
                  stroke="#8192a7"
                  strokeDasharray="3 4"
                  pointerEvents="none"
                />
              )}
              <Tooltip
                cursor={{ stroke: "#8192a7", strokeDasharray: "3 4" }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const orderCount = Number(payload.find((entry) => entry.dataKey === "orders")?.value ?? 0);
                  const quotationCount = Number(payload.find((entry) => entry.dataKey === "quotations")?.value ?? 0);
                  return (
                    <div className="rounded-lg bg-[#041627] px-3 py-2 text-white shadow-lg">
                      <p className="text-xs font-bold mb-1">{label}</p>
                      <p className="text-[11px]">
                        <span className="text-[#92ccff]">Pedidos:</span> {orderCount.toLocaleString("pt-BR")}
                      </p>
                      <p className="text-[11px]">
                        <span className="text-[#c4c6cd]">Orçamentos:</span>{" "}
                        {quotationCount.toLocaleString("pt-BR")}
                      </p>
                    </div>
                  );
                }}
              />
              <Line
                type="linear"
                dataKey="orders"
                name="Pedidos"
                stroke="#006397"
                strokeWidth={hoveredSeries === "orders" ? 4 : 3}
                strokeOpacity={hoveredSeries && hoveredSeries !== "orders" ? 0.35 : 1}
                dot={{ r: 3, fill: "#006397", stroke: "white" }}
                activeDot={{ r: 6, fill: "#006397", stroke: "white", strokeWidth: 2 }}
                isAnimationActive
                animationDuration={800}
                onMouseEnter={() => setHoveredSeries("orders")}
                onMouseLeave={() => setHoveredSeries(null)}
              />
              <Line
                type="linear"
                dataKey="quotations"
                name="Orçamentos"
                stroke="#8192a7"
                strokeWidth={hoveredSeries === "quotations" ? 3.5 : 2}
                strokeOpacity={hoveredSeries && hoveredSeries !== "quotations" ? 0.35 : 1}
                strokeDasharray="5 4"
                dot={{ r: 3, fill: "#8192a7", stroke: "white" }}
                activeDot={{ r: 6, fill: "#8192a7", stroke: "white", strokeWidth: 2 }}
                isAnimationActive
                animationDuration={800}
                onMouseEnter={() => setHoveredSeries("quotations")}
                onMouseLeave={() => setHoveredSeries(null)}
              />
            </LineChart>
          </ResponsiveContainer>
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
