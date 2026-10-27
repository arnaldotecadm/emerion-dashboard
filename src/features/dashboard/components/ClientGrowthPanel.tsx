import { useTheme } from "../../../theme/ThemeContext";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GROWTH_POINTS, GROWTH_SUMMARY } from "../data/clientesData";

/** Bar chart comparing new client acquisition against churn over the last 6 months. */
function ClientGrowthPanel() {
  const inkColor = useTheme().theme === "dark" ? "#f1f5f9" : "#041627";
  return (
    <div className="bg-card p-6 rounded-xl shadow-card border border-line h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-fg-strong text-lg">Novos Clientes vs Churn</h3>
        <div className="text-right shrink-0">
          <p className="text-2xl font-black text-accent">+{GROWTH_SUMMARY.net}</p>
          <p className="text-[9px] text-fg-subtle font-bold uppercase">Crescimento Líquido (6m)</p>
        </div>
      </div>
      <div className="min-h-32 mt-6 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={GROWTH_POINTS} margin={{ top: 4, right: 4, bottom: 0, left: 4 }} accessibilityLayer>
            <XAxis
              dataKey="label"
              tickFormatter={(label: string) => label.toLocaleUpperCase("pt-BR")}
              tick={{ fill: "#8192a7", fontSize: 10, fontWeight: 700 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              cursor={{ fill: "#f7f9fb" }}
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as (typeof GROWTH_POINTS)[number] | undefined;
                if (!active || !point) return null;
                return (
                  <div className="rounded-lg bg-ink-solid px-3 py-2 text-white shadow-lg">
                    <p className="text-xs font-bold">{point.label}</p>
                    <p className="text-[11px]">{point.newClients} novos clientes</p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="heightPct"
              name="Novos clientes"
              maxBarSize={48}
              radius={[4, 4, 0, 0]}
              activeBar={{ stroke: inkColor, strokeWidth: 2 }}
              isAnimationActive
            >
              {GROWTH_POINTS.map((point, index) => (
                <Cell
                  key={point.label}
                  fill={index === GROWTH_POINTS.length - 1 ? inkColor : "#006397"}
                  fillOpacity={index === GROWTH_POINTS.length - 1 ? 1 : 0.35 + (index / GROWTH_POINTS.length) * 0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-line-soft flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-solid" />
          <span className="text-xs text-fg-subtle">Novos: {GROWTH_SUMMARY.newTotal}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-line-strong" />
          <span className="text-xs text-fg-subtle">Churn: {GROWTH_SUMMARY.churnTotal}</span>
        </div>
      </div>
    </div>
  );
}

export default ClientGrowthPanel;
