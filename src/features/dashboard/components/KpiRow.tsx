import { Link } from "react-router-dom";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { formatCurrency } from "../utils/format";

interface KpiCard {
  label: string;
  value: string;
  hint?: string;
  to: string;
  variant?: "default" | "highlight";
}

/** Top row of KPI summary cards for the executive dashboard, backed by real ERP data. */
function KpiRow() {
  const { loading, error, totalVendas, totalPedidos, ticketMedio, totalClientes, totalVendedores, isPartial } =
    useDashboardOverview();

  if (error) {
    return (
      <section className="bg-white p-6 rounded-xl shadow-card border border-[#e6e8ea] mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-[#ba1a1a]">error</span>
        <p className="text-sm text-[#44474c]">{error}</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-card animate-pulse">
            <div className="h-3 w-24 bg-[#eceef0] rounded-full mb-4" />
            <div className="h-8 w-20 bg-[#eceef0] rounded-full" />
          </div>
        ))}
      </section>
    );
  }

  const sampleHint = isPartial ? "Baseado nos pedidos mais recentes" : "Baseado em todos os pedidos";

  const KPIS: KpiCard[] = [
    {
      label: "VENDAS TOTAIS",
      value: formatCurrency(totalVendas),
      hint: sampleHint,
      variant: "highlight",
      to: "/dashboard/pedidos",
    },
    {
      label: "TOTAL DE PEDIDOS",
      value: totalPedidos.toLocaleString("pt-BR"),
      to: "/dashboard/pedidos",
    },
    {
      label: "TICKET MÉDIO",
      value: formatCurrency(ticketMedio),
      hint: sampleHint,
      to: "/dashboard/pedidos",
    },
    {
      label: "TOTAL DE CLIENTES",
      value: totalClientes.toLocaleString("pt-BR"),
      to: "/dashboard/clientes",
    },
    {
      label: "TOTAL DE VENDEDORES",
      value: totalVendedores.toLocaleString("pt-BR"),
      to: "/dashboard/vendedores",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {KPIS.map((kpi) => {
        const isHighlight = kpi.variant === "highlight";

        return (
          <Link
            key={kpi.label}
            to={kpi.to}
            className={`group relative bg-white p-6 rounded-xl shadow-card transition-all duration-200 cursor-pointer hover:shadow-[0px_8px_20px_rgba(0,99,151,0.18)] hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006397] min-w-0 ${
              isHighlight ? "border-l-4 border-[#006397]" : ""
            }`}
          >
            <span className="absolute top-4 right-4 text-[#006397] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </span>
            <p className="text-xs font-semibold tracking-wide mb-2 text-[#44474c] truncate pr-6">{kpi.label}</p>
            <h2
              title={kpi.value}
              className="text-2xl lg:text-[28px] xl:text-[32px] leading-tight font-bold tracking-tight text-[#041627] truncate"
            >
              {kpi.value}
            </h2>
            {kpi.hint && <p className="text-xs font-medium mt-2 text-[#8192a7] truncate">{kpi.hint}</p>}
          </Link>
        );
      })}
    </section>
  );
}

export default KpiRow;
