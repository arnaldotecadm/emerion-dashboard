import { useTheme } from "../../../theme/ThemeContext";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import type { DashboardOrdersByRegion } from "../types/dashboardTopTrends";

type RegionalSeriesKey = keyof Omit<DashboardOrdersByRegion, "region">;

interface HoveredRegionalBar {
  regionIndex: number;
  seriesKey: RegionalSeriesKey;
}

const SERIES: { key: RegionalSeriesKey; label: string; color: string }[] = [
  { key: "faturado", label: "Faturado", color: "#006397" },
  { key: "cancelado", label: "Cancelado", color: "#ba1a1a" },
  { key: "outros", label: "Outros", color: "#92ccff" },
];

const REGION_SLOT_WIDTH = 88;

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Bar chart card showing billed, cancelled and other order values per region. */
function RegionalBarChart() {
  const inkColor = useTheme().theme === "dark" ? "#f1f5f9" : "#041627";
  const { loading, error, ordersByRegion } = useDashboardOverview();
  const [hoveredBar, setHoveredBar] = useState<HoveredRegionalBar | null>(null);
  const hoveredRegion = hoveredBar ? ordersByRegion[hoveredBar.regionIndex] : undefined;

  return (
    <div className="bg-card p-6 rounded-xl shadow-card flex flex-col h-[400px]">
      <h3 className="text-xl font-semibold text-fg-strong">Situação dos Pedidos por Região</h3>
      <p className="text-xs text-fg-subtle mt-1 mb-4">Valores em reais</p>

      {error && <p className="flex-1 flex items-center justify-center text-sm text-danger-fg">{error}</p>}

      {!error && loading && (
        <div className="flex-1 flex items-center animate-pulse">
          <div className="w-full h-56 bg-surface-2 rounded-lg" />
        </div>
      )}

      {!error && !loading && ordersByRegion.length === 0 && (
        <p className="flex-1 flex items-center justify-center text-sm text-fg-subtle">
          Nenhum dado disponível por região.
        </p>
      )}

      {!error && !loading && ordersByRegion.length > 0 && (
        <div className="relative flex-1 min-h-0 min-w-0 overflow-x-auto" onPointerLeave={() => setHoveredBar(null)}>
          <div
            className="h-full w-full"
            style={{ minWidth: ordersByRegion.length * REGION_SLOT_WIDTH }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ordersByRegion}
                margin={{ top: 8, right: 8, bottom: 24, left: 8 }}
                barCategoryGap="30%"
                accessibilityLayer
                onMouseLeave={() => setHoveredBar(null)}
                aria-label="Valores faturados, cancelados e outros por região"
              >
                <CartesianGrid vertical={false} stroke="#e6e8ea" />
                <XAxis
                  dataKey="region"
                  tick={{ fill: "#44474c", fontSize: 11, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis hide domain={[0, "auto"]} />
                {hoveredRegion && (
                  <ReferenceLine
                    x={hoveredRegion.region}
                    stroke="#8192a7"
                    strokeDasharray="3 4"
                    pointerEvents="none"
                  />
                )}
                <Tooltip
                  cursor={{ fill: "#f7f9fb", opacity: 0.75 }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const item = payload.find((entry) => entry.dataKey === hoveredBar?.seriesKey) ?? payload[0];
                    const series = SERIES.find(({ key }) => key === item.dataKey);
                    const value = Number(item.value ?? 0);
                    return (
                      <div className="rounded-lg bg-ink-solid px-3 py-2 text-white shadow-lg">
                        <p className="text-xs font-bold mb-1">{label}</p>
                        <p className="text-[11px] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                          {series?.label}: {formatCurrency(value)}
                        </p>
                      </div>
                    );
                  }}
                />
                {SERIES.map((series) => (
                  <Bar
                    key={series.key}
                    dataKey={series.key}
                    name={series.label}
                    fill={series.color}
                    maxBarSize={32}
                    isAnimationActive
                    onMouseEnter={(_, index) => setHoveredBar({ regionIndex: index, seriesKey: series.key })}
                  >
                    {ordersByRegion.map((region, index) => {
                      const selected = hoveredBar?.regionIndex === index && hoveredBar.seriesKey === series.key;
                      return (
                        <Cell
                          key={region.region}
                          fillOpacity={hoveredBar && !selected ? 0.35 : 1}
                          stroke={selected ? inkColor : "transparent"}
                          strokeWidth={selected ? 2 : 0}
                        />
                      );
                    })}
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-line flex flex-wrap gap-x-5 gap-y-2">
        {SERIES.map((series) => (
          <div key={series.key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: series.color }} />
            <span className="text-xs">{series.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RegionalBarChart;
