import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Channel {
  label: string;
  pct: number;
  opacity: number;
}

const CHANNELS: Channel[] = [
  { label: "E-commerce", pct: 42, opacity: 1 },
  { label: "Vendedor Externo", pct: 28, opacity: 0.7 },
  { label: "Televendas", pct: 18, opacity: 0.5 },
  { label: "Parceiros", pct: 12, opacity: 0.3 },
];

/** Breakdown of sales share by channel (e-commerce, field reps, telesales, partners). */
function SalesChannelPanel() {
  return (
    <div className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#041627]">Vendas por Canal</h3>
        <span className="material-symbols-outlined text-[#8192a7]">pie_chart</span>
      </div>
      <div className="h-[208px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={CHANNELS}
            layout="vertical"
            margin={{ top: 4, right: 28, bottom: 4, left: 0 }}
            barCategoryGap={24}
            accessibilityLayer
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="label"
              width={126}
              tick={{ fill: "#44474c", fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                const channel = payload?.[0]?.payload as Channel | undefined;
                if (!active || !channel) return null;
                return (
                  <div className="rounded-lg bg-[#041627] px-3 py-2 text-white shadow-lg">
                    <p className="text-xs font-bold">{channel.label}</p>
                    <p className="text-[11px]">{channel.pct}%</p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="pct"
              name="Participação"
              barSize={8}
              radius={4}
              background={{ fill: "#eceef0", radius: 4 }}
              activeBar={{ stroke: "#041627", strokeWidth: 1 }}
              isAnimationActive
            >
              {CHANNELS.map((channel) => (
                <Cell key={channel.label} fill="#006397" fillOpacity={channel.opacity} />
              ))}
              <LabelList
                dataKey="pct"
                position="right"
                formatter={(value) => `${value}%`}
                style={{ fill: "#041627", fontSize: 12, fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesChannelPanel;
