const INSIGHTS = [
  {
    text: "Foque nos 5 maiores clientes inativos há mais de 30 dias para recuperação imediata.",
  },
  {
    text: "Aumento de 15% na conversão detectado na região Sul. Replicar estratégia no Sudeste.",
  },
];

/** AI-style panel surfacing short, actionable recommendations for managers. */
function InsightsPanel() {
  return (
    <div className="bg-[#006397] p-6 rounded-xl shadow-card text-white relative overflow-hidden h-full flex flex-col group">
      <span className="material-symbols-outlined absolute -right-4 -top-4 text-[120px] opacity-10 group-hover:scale-110 transition-transform duration-700">
        lightbulb
      </span>
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="font-bold flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#92ccff]">auto_awesome</span>
          Insights IA
        </h3>
        <div className="space-y-3 flex-1">
          {INSIGHTS.map((insight) => (
            <div key={insight.text} className="bg-white/10 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
              <p className="text-xs leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform w-fit">
          Ver todos os insights
          <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
        </button>
      </div>
    </div>
  );
}

export default InsightsPanel;
