import { useTheme } from "../../../theme/ThemeContext";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardTrendByMonth } from "../types/dashboardTopTrends";

interface ClientGrowthPanelProps {
  data: DashboardTrendByMonth[];
  loading: boolean;
  error: string | null;
}

/** Bar chart showing monthly customer acquisition from the ERP backend. */
function ClientGrowthPanel({ data, loading, error }: ClientGrowthPanelProps) {
  const inkColor = useTheme().theme === "dark" ? "#f1f5f9" : "#041627";
  const points = data.map((item) => {
    const [year, month] = item.yearMonth.split("-").map(Number);
    return {
      ...item,
      label: new Date(year, month - 1)
        .toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
        .replace(".", ""),
    };
  });
  const total = points.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...points.map((item) => item.count), 1);

  return (
    <div className="bg-card p-6 rounded-xl shadow-card border border-line h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-fg-strong text-lg">Novos Clientes por Mês</h3>
        <div className="text-right shrink-0">
          <p className="text-2xl font-black text-accent">{total.toLocaleString("pt-BR")}</p>
          <p className="text-[9px] text-fg-subtle font-bold uppercase">Novos no período</p>
        </div>
      </div>
      <div className="min-h-32 mt-6 flex-1">
        {loading || error || data.length === 0 ? (
          <div className="h-full min-h-32 flex items-center justify-center text-xs text-fg-subtle">
            {loading ? "Carregando novos clientes..." : error ?? "Nenhum dado mensal disponível."}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={points} margin={{ top: 4, right: 4, bottom: 0, left: 4 }} accessibilityLayer>
              <XAxis
                dataKey="label"
                tickFormatter={(label: string) => label.toLocaleUpperCase("pt-BR")}
                tick={{ fill: "#8192a7", fontSize: 10, fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide domain={[0, maxCount]} />
              <Tooltip
                cursor={{ fill: "#f7f9fb" }}
                content={({ active, payload }) => {
                  const point = payload?.[0]?.payload as (typeof points)[number] | undefined;
                  if (!active || !point) return null;
                  return (
                    <div className="rounded-lg bg-ink-solid px-3 py-2 text-white shadow-lg">
                      <p className="text-xs font-bold">{point.label}</p>
                      <p className="text-[11px]">{point.count} novos clientes</p>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="count"
                name="Novos clientes"
                maxBarSize={48}
                radius={[4, 4, 0, 0]}
                activeBar={{ stroke: inkColor, strokeWidth: 2 }}
                isAnimationActive
              >
                {points.map((point, index) => (
                  <Cell
                    key={point.yearMonth}
                    fill={index === points.length - 1 ? inkColor : "#006397"}
                    fillOpacity={index === points.length - 1 ? 1 : 0.35 + (index / points.length) * 0.6}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-line-soft flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-solid" />
          <span className="text-xs text-fg-subtle">Novos clientes cadastrados</span>
        </div>
      </div>
    </div>
  );
}

export default ClientGrowthPanel;
