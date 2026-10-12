import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts";

export interface GoalProgressPanelProps {
  /** Percentage of the period's target already achieved (0-100). */
  progressPct: number;
  /** Human-readable remaining amount, e.g. "R$ 745.000". */
  remainingLabel: string;
  /** Human-readable target amount, e.g. "R$ 5M". */
  targetLabel: string;
}

/** Circular progress card comparing realized sales against the period's target/quota. */
function GoalProgressPanel({ progressPct, remainingLabel, targetLabel }: GoalProgressPanelProps) {
  const data = [{ value: progressPct }];

  return (
    <div className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-6 h-full flex flex-col items-center text-center">
      <h3 className="font-bold text-[#041627] mb-6 w-full text-left">Metas vs Realizado</h3>
      <div className="relative w-32 h-32 flex items-center justify-center mb-4 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            startAngle={90}
            endAngle={-270}
            innerRadius="73%"
            outerRadius="89%"
            barSize={10}
            accessibilityLayer
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              fill="#006397"
              background={{ fill: "#eceef0" }}
              cornerRadius="50%"
              isAnimationActive
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg bg-[#041627] px-3 py-2 text-white shadow-lg">
                    <p className="text-[11px]">Meta atingida: {progressPct}%</p>
                  </div>
                );
              }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <span className="absolute text-2xl font-black text-[#041627] pointer-events-none">{progressPct}%</span>
      </div>
      <p className="text-xs font-bold text-[#8192a7] uppercase tracking-widest mb-1">Status da Meta</p>
      <p className="text-xs text-[#8192a7] leading-relaxed px-2">
        Faltam {remainingLabel} para atingir o objetivo do período de {targetLabel}.
      </p>
      <button className="mt-6 w-full py-2.5 border border-[#e6e8ea] rounded-lg text-xs font-bold text-[#006397] hover:bg-[#f7f9fb] transition-colors uppercase tracking-widest">
        Ver Plano de Ação
      </button>
    </div>
  );
}

export default GoalProgressPanel;
