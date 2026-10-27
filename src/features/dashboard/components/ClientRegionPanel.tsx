import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CLIENT_REGIONS, CLIENTES_DIRECTORY_TOTAL } from "../data/clientesData";

/** Donut chart card breaking down the client base by Brazilian macro-region (no segment taxonomy exists). */
function ClientRegionPanel() {
  return (
    <div className="bg-card p-6 rounded-xl shadow-card border border-line h-full">
      <h3 className="font-bold text-fg-strong text-lg mb-4">Distribuição por Região</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart accessibilityLayer>
              <Pie
                data={CLIENT_REGIONS}
                dataKey="pct"
                nameKey="label"
                innerRadius="76%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                stroke="none"
                isAnimationActive
              >
                {CLIENT_REGIONS.map((slice) => <Cell key={slice.label} fill={slice.color} />)}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  const slice = payload?.[0]?.payload as (typeof CLIENT_REGIONS)[number] | undefined;
                  if (!active || !slice) return null;
                  return (
                    <div className="rounded-lg bg-ink-solid px-3 py-2 text-white shadow-lg">
                      <p className="text-xs font-bold">{slice.label}</p>
                      <p className="text-[11px]">{slice.pct}%</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-lg font-bold text-fg-strong">{CLIENTES_DIRECTORY_TOTAL.toLocaleString("pt-BR")}</p>
            <p className="text-[9px] text-fg-subtle font-bold uppercase">Total</p>
          </div>
        </div>
        <div className="space-y-2">
          {CLIENT_REGIONS.map((slice) => (
            <div key={slice.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="text-xs text-fg-muted">
                {slice.label} ({slice.pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClientRegionPanel;
