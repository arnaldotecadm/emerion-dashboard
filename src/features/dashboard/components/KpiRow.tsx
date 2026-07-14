export interface Kpi {
  label: string;
  value: string;
  trend?: string;
  trendIcon?: string;
  trendClass?: string;
  progress?: number;
  variant?: "default" | "highlight" | "danger";
}

const KPIS: Kpi[] = [
  {
    label: "VENDAS TOTAIS",
    value: "R$ 4.2M",
    trend: "+12% vs mês ant.",
    trendIcon: "trending_up",
    trendClass: "text-[#18a659]",
    variant: "highlight",
  },
  {
    label: "TOTAL DE ORÇAMENTOS",
    value: "1.2k",
    trend: "+5% vs mês ant.",
    trendIcon: "trending_up",
    trendClass: "text-[#18a659]",
  },
  {
    label: "TICKET MÉDIO",
    value: "R$ 3.5k",
    trend: "-2% vs mês ant.",
    trendIcon: "trending_down",
    trendClass: "text-[#ba1a1a]",
  },
  {
    label: "PEDIDOS ATRASADOS",
    value: "42",
    trend: "Ação requerida",
    trendIcon: "warning",
    variant: "danger",
  },
  {
    label: "LIMITE DE CRÉDITO",
    value: "68%",
    progress: 68,
  },
];

/** Top row of KPI summary cards for the executive dashboard. */
function KpiRow() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      {KPIS.map((kpi) => {
        const isDanger = kpi.variant === "danger";
        const isHighlight = kpi.variant === "highlight";

        return (
          <div
            key={kpi.label}
            className={
              isDanger
                ? "bg-[#ffdad6] p-6 rounded-xl shadow-[0px_4px_12px_rgba(26,43,60,0.05)]"
                : `bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(26,43,60,0.05)] ${
                    isHighlight ? "border-l-4 border-[#006397]" : ""
                  }`
            }
          >
            <p
              className={`text-xs font-semibold tracking-wide mb-2 ${
                isDanger ? "text-[#93000a]" : "text-[#44474c]"
              }`}
            >
              {kpi.label}
            </p>
            <h2
              className={`text-[36px] leading-[44px] font-bold tracking-tight ${
                isDanger ? "text-[#93000a]" : "text-[#041627]"
              }`}
            >
              {kpi.value}
            </h2>
            {kpi.trend && (
              <div
                className={`flex items-center gap-1 mt-2 ${
                  isDanger ? "text-[#93000a]" : kpi.trendClass ?? "text-[#44474c]"
                }`}
              >
                {kpi.trendIcon && (
                  <span className="material-symbols-outlined text-sm">{kpi.trendIcon}</span>
                )}
                <span className="text-xs font-semibold">{kpi.trend}</span>
              </div>
            )}
            {kpi.progress !== undefined && (
              <div className="w-full bg-[#e6e8ea] h-2 rounded-full mt-4">
                <div
                  className="bg-[#18a659] h-2 rounded-full"
                  style={{ width: `${kpi.progress}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

export default KpiRow;
