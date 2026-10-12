import { useState } from "react";
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

const CHART_HEIGHT = 240;
const CHART_PADDING_TOP = 16;
const CHART_PADDING_BOTTOM = 52;
const MIN_CHART_WIDTH = 600;
const REGION_SLOT_WIDTH = 88;

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getRegionValue(region: DashboardOrdersByRegion, seriesKey: keyof Omit<DashboardOrdersByRegion, "region">) {
  return region[seriesKey];
}

/** Bar chart card showing billed, cancelled and other order values per region. */
function RegionalBarChart() {
  const { loading, error, ordersByRegion } = useDashboardOverview();
  const [hoveredBar, setHoveredBar] = useState<HoveredRegionalBar | null>(null);
  const chartWidth = Math.max(MIN_CHART_WIDTH, ordersByRegion.length * REGION_SLOT_WIDTH);
  const plotHeight = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;
  const maxValue = Math.max(0, ...ordersByRegion.flatMap((region) => SERIES.map(({ key }) => getRegionValue(region, key))));
  const scaleMax = maxValue || 1;
  const slotWidth = chartWidth / Math.max(ordersByRegion.length, 1);
  const barWidth = Math.min(24, slotWidth / 5);
  const hoveredRegion = hoveredBar ? ordersByRegion[hoveredBar.regionIndex] : undefined;
  const hoveredSeries = hoveredBar ? SERIES.find(({ key }) => key === hoveredBar.seriesKey) : undefined;

  return (
    <div className="bg-white p-6 rounded-xl shadow-card flex flex-col h-[400px]">
      <h3 className="text-xl font-semibold text-[#041627]">Situação dos Pedidos por Região</h3>
      <p className="text-xs text-[#8192a7] mt-1 mb-4">Valores em reais</p>

      {error && <p className="flex-1 flex items-center justify-center text-sm text-[#ba1a1a]">{error}</p>}

      {!error && loading && (
        <div className="flex-1 flex items-center animate-pulse">
          <div className="w-full h-56 bg-[#eceef0] rounded-lg" />
        </div>
      )}

      {!error && !loading && ordersByRegion.length === 0 && (
        <p className="flex-1 flex items-center justify-center text-sm text-[#8192a7]">
          Nenhum dado disponível por região.
        </p>
      )}

      {!error && !loading && ordersByRegion.length > 0 && (
        <div className="relative flex-1 overflow-x-auto" onPointerLeave={() => setHoveredBar(null)}>
          {hoveredRegion && hoveredSeries && (
            <div className="absolute right-2 top-2 z-10 rounded-lg bg-[#041627] px-3 py-2 text-white shadow-lg pointer-events-none">
              <p className="text-xs font-bold mb-1">{hoveredRegion.region}</p>
              <p className="text-[11px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: hoveredSeries.color }} />
                {hoveredSeries.label}: {formatCurrency(getRegionValue(hoveredRegion, hoveredSeries.key))}
              </p>
            </div>
          )}
          <svg
            className="h-full min-h-56"
            style={{ width: chartWidth }}
            viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
            role="img"
            aria-label="Valores faturados, cancelados e outros por região"
          >
            {[0, 0.5, 1].map((ratio) => {
              const y = CHART_HEIGHT - CHART_PADDING_BOTTOM - ratio * plotHeight;
              return (
                <line
                  key={ratio}
                  x1="0"
                  x2={chartWidth}
                  y1={y}
                  y2={y}
                  stroke="#e6e8ea"
                  strokeWidth="1"
                  pointerEvents="none"
                />
              );
            })}
            {ordersByRegion.map((region, regionIndex) => {
              const groupCenter = (regionIndex + 0.5) * slotWidth;
              const groupWidth = SERIES.length * barWidth;
              const groupStart = groupCenter - groupWidth / 2;
              const isRegionHovered = hoveredBar?.regionIndex === regionIndex;

              return (
                <g key={region.region}>
                  {isRegionHovered && (
                    <line
                      x1={groupCenter}
                      x2={groupCenter}
                      y1={CHART_PADDING_TOP}
                      y2={CHART_HEIGHT - CHART_PADDING_BOTTOM}
                      stroke="#8192a7"
                      strokeDasharray="3 4"
                      strokeWidth="1"
                      pointerEvents="none"
                    />
                  )}
                  {SERIES.map((series, seriesIndex) => {
                    const value = getRegionValue(region, series.key);
                    const barHeight = (value / scaleMax) * plotHeight;
                    const x = groupStart + seriesIndex * barWidth;
                    const y = CHART_HEIGHT - CHART_PADDING_BOTTOM - barHeight;
                    const isBarHovered =
                      isRegionHovered && hoveredBar?.seriesKey === series.key;

                    return (
                      <rect
                        key={series.key}
                        x={x}
                        y={y}
                        width={barWidth - 3}
                        height={Math.max(barHeight, 1)}
                        rx="2"
                        fill={series.color}
                        opacity={hoveredBar && !isBarHovered ? 0.35 : 1}
                        stroke={isBarHovered ? "#041627" : "transparent"}
                        strokeWidth={isBarHovered ? "2" : "0"}
                        tabIndex={0}
                        role="button"
                        aria-label={`${region.region}, ${series.label}: ${formatCurrency(value)}`}
                        onPointerEnter={() => setHoveredBar({ regionIndex, seriesKey: series.key })}
                        onFocus={() => setHoveredBar({ regionIndex, seriesKey: series.key })}
                        onBlur={() => setHoveredBar(null)}
                        className="cursor-pointer transition-opacity"
                      >
                        <title>{`${region.region} — ${series.label}: ${formatCurrency(value)}`}</title>
                      </rect>
                    );
                  })}
                  <text
                    x={groupCenter}
                    y={CHART_HEIGHT - 20}
                    textAnchor="middle"
                    fill={isRegionHovered ? "#006397" : "#44474c"}
                    fontSize="11"
                    fontWeight="600"
                    pointerEvents="none"
                  >
                    {region.region}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-[#e6e8ea] flex flex-wrap gap-x-5 gap-y-2">
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
