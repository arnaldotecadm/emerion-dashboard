import { Link } from "react-router-dom";

export interface Kpi {
  label: string;
  value: string;
  trend?: string;
  trendIcon?: string;
  trendClass?: string;
  progress?: number;
  variant?: "default" | "highlight" | "danger";
  /** Route this card drills into when clicked. */
  to: string;
}

const KPIS: Kpi[] = [
  {
    label: "VENDAS TOTAIS",
    value: "R$ 4.2M",
    trend: "+12% vs mês ant.",
    trendIcon: "trending_up",
    trendClass: "text-[#18a659]",
    variant: "highlight",
    to: "/dashboard/vendas",
  },
  {
    label: "TOTAL DE ORÇAMENTOS",
    value: "1.2k",
    trend: "+5% vs mês ant.",
    trendIcon: "trending_up",
    trendClass: "text-[#18a659]",
    to: "/dashboard/pedidos",
  },
  {
    label: "TICKET MÉDIO",
    value: "R$ 3.5k",
    trend: "-2% vs mês ant.",
    trendIcon: "trending_down",
    trendClass: "text-[#ba1a1a]",
    to: "/dashboard/pedidos",
  },
  {
    label: "PEDIDOS ATRASADOS",
    value: "42",
    trend: "Ação requerida",
    trendIcon: "warning",
    variant: "danger",
    to: "/dashboard/pedidos",
  },
  {
    label: "LIMITE DE CRÉDITO",
    value: "68%",
    progress: 68,
    to: "/dashboard/clientes",
  },
];

/** Top row of KPI summary cards for the executive dashboard. Each card drills into its related page. */
function KpiRow() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      {KPIS.map((kpi) => {
        const isDanger = kpi.variant === "danger";
        const isHighlight = kpi.variant === "highlight";

        return (
          <Link
            key={kpi.label}
            to={kpi.to}
            className={
              isDanger
                ? "group relative bg-[#ffdad6] p-6 rounded-xl shadow-card transition-all duration-200 cursor-pointer hover:shadow-[0px_8px_20px_rgba(186,26,26,0.25)] hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ba1a1a]"
                : `group relative bg-white p-6 rounded-xl shadow-card transition-all duration-200 cursor-pointer hover:shadow-[0px_8px_20px_rgba(0,99,151,0.18)] hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006397] ${
                    isHighlight ? "border-l-4 border-[#006397]" : ""
                  }`
            }
          >
            <span className="absolute top-4 right-4 text-[#006397] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </span>
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
          </Link>
        );
      })}
    </section>
  );
}

export default KpiRow;
