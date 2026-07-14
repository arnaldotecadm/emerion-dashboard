interface Channel {
  label: string;
  pct: number;
  barClass: string;
}

const CHANNELS: Channel[] = [
  { label: "E-commerce", pct: 42, barClass: "bg-[#006397]" },
  { label: "Vendedor Externo", pct: 28, barClass: "bg-[#006397]/70" },
  { label: "Televendas", pct: 18, barClass: "bg-[#006397]/50" },
  { label: "Parceiros", pct: 12, barClass: "bg-[#006397]/30" },
];

/** Breakdown of sales share by channel (e-commerce, field reps, telesales, partners). */
function SalesChannelPanel() {
  return (
    <div className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#041627]">Vendas por Canal</h3>
        <span className="material-symbols-outlined text-[#8192a7]">pie_chart</span>
      </div>
      <div className="space-y-5">
        {CHANNELS.map((channel) => (
          <div key={channel.label}>
            <div className="flex justify-between text-xs font-bold text-[#44474c] mb-2">
              <span>{channel.label}</span>
              <span className="text-[#041627]">{channel.pct}%</span>
            </div>
            <div className="w-full bg-[#eceef0] h-2 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${channel.barClass}`} style={{ width: `${channel.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalesChannelPanel;
