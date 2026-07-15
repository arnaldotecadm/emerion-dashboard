import { GROWTH_POINTS, GROWTH_SUMMARY } from "../data/clientesData";

/** Bar chart comparing new client acquisition against churn over the last 6 months. */
function ClientGrowthPanel() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-card border border-[#e6e8ea] h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-[#041627] text-lg">Novos Clientes vs Churn</h3>
        <div className="text-right shrink-0">
          <p className="text-2xl font-black text-[#006397]">+{GROWTH_SUMMARY.net}</p>
          <p className="text-[9px] text-[#8192a7] font-bold uppercase">Crescimento Líquido (6m)</p>
        </div>
      </div>
      <div className="h-32 mt-6 flex items-end gap-1.5 flex-1">
        {GROWTH_POINTS.map((point, index) => (
          <div
            key={point.label}
            className="flex-1 rounded-t transition-all cursor-help hover:opacity-80"
            style={{
              height: `${point.heightPct}%`,
              backgroundColor: index === GROWTH_POINTS.length - 1 ? "#041627" : "#006397",
              opacity: index === GROWTH_POINTS.length - 1 ? 1 : 0.35 + (index / GROWTH_POINTS.length) * 0.6,
            }}
            title={`${point.label}: ${point.newClients} novos`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-[#8192a7] mt-2 font-bold uppercase tracking-wider">
        {GROWTH_POINTS.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-[#f7f9fb] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#006397]" />
          <span className="text-xs text-[#8192a7]">Novos: {GROWTH_SUMMARY.newTotal}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#c4c6cd]" />
          <span className="text-xs text-[#8192a7]">Churn: {GROWTH_SUMMARY.churnTotal}</span>
        </div>
      </div>
    </div>
  );
}

export default ClientGrowthPanel;
