interface PipelineStat {
  label: string;
  value: string;
  hint: string;
  hintClass?: string;
}

const STATS: PipelineStat[] = [
  { label: "Cobertura", value: "2.4x", hint: "vs 1.8x meta", hintClass: "text-[#18a659]" },
  { label: "Ciclo Médio", value: "14 dias", hint: "-2 dias vs anterior", hintClass: "text-[#18a659]" },
  { label: "Ticket/Negócio", value: "R$ 12,4k", hint: "Acima da média", hintClass: "text-[#006397]" },
];

/** Pipeline health summary: coverage ratio, win-rate gauge, sales cycle and average deal size. */
function PipelineHealthPanel() {
  // 68% conversion gauge — circumference for r=28 is ~175.9; offset shows the filled portion.
  const conversionPct = 68;
  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference * (1 - conversionPct / 100);

  return (
    <div className="bg-white p-6 rounded-xl shadow-card h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-[#041627] flex items-center gap-2 text-xl">
          <span className="material-symbols-outlined text-[#006397]">health_metrics</span>
          Saúde do Pipeline
        </h3>
        <span className="text-xs text-[#8192a7] font-medium">Meta Trimestral: R$ 12M</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center md:border-r border-[#e6e8ea]">
          <p className="text-[10px] font-bold text-[#8192a7] uppercase mb-2">{STATS[0].label}</p>
          <div className="text-2xl font-black text-[#041627]">{STATS[0].value}</div>
          <p className={`text-[10px] font-medium mt-1 ${STATS[0].hintClass}`}>{STATS[0].hint}</p>
        </div>
        <div className="flex flex-col items-center md:border-r border-[#e6e8ea]">
          <p className="text-[10px] font-bold text-[#8192a7] uppercase mb-1">Conversão</p>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="#e6e8ea" strokeWidth="6" />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="transparent"
                stroke="#006397"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-bold text-[#041627]">{conversionPct}%</span>
          </div>
        </div>
        <div className="text-center md:border-r border-[#e6e8ea]">
          <p className="text-[10px] font-bold text-[#8192a7] uppercase mb-2">{STATS[1].label}</p>
          <div className="text-2xl font-black text-[#041627]">{STATS[1].value}</div>
          <p className={`text-[10px] font-medium mt-1 ${STATS[1].hintClass}`}>{STATS[1].hint}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-[#8192a7] uppercase mb-2">{STATS[2].label}</p>
          <div className="text-2xl font-black text-[#041627]">{STATS[2].value}</div>
          <p className={`text-[10px] font-medium mt-1 ${STATS[2].hintClass}`}>{STATS[2].hint}</p>
        </div>
      </div>
    </div>
  );
}

export default PipelineHealthPanel;
