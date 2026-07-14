import { useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency, VENDAS_DATASETS, type Granularity } from "../data/vendasTotaisData";

const GRANULARITY_OPTIONS: { value: Granularity; label: string }[] = [
  { value: "dia", label: "Dia" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mês" },
];

/** Detail/drill-down page for the "Vendas Totais" KPI, with a day/week/month sales trend view. */
function VendasTotaisPage() {
  const [granularity, setGranularity] = useState<Granularity>("mes");
  const dataset = VENDAS_DATASETS[granularity];
  const variation = ((dataset.total - dataset.previousTotal) / dataset.previousTotal) * 100;
  const isPositive = variation >= 0;
  const bestPoint = dataset.points.reduce((best, point) => (point.value > best.value ? point : best));

  return (
    <div>
      <Link
        to="/dashboard"
        className="text-[#44474c] hover:text-[#006397] flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Voltar para Visão Geral
      </Link>

      {/* Header card: total value, comparison badge, granularity toggle, trend chart */}
      <section className="bg-white rounded-xl p-8 shadow-card border border-[#e6e8ea] mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#8192a7] text-sm font-medium mb-1 block uppercase tracking-wider">
              {dataset.totalLabel}
            </span>
            <div className="flex items-baseline gap-4 flex-wrap">
              <h3 className="text-4xl font-extrabold text-[#041627] tracking-tight">
                {formatCurrency(dataset.total)}
              </h3>
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-bold border ${
                  isPositive
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-[#ffdad6] text-[#93000a] border-[#ffb4ab]"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {isPositive ? "trending_up" : "trending_down"}
                </span>
                {isPositive ? "+" : ""}
                {variation.toFixed(1)}%
              </span>
            </div>
            <p className="text-[#8192a7] text-xs mt-2 italic">
              Comparado ao período anterior ({formatCurrency(dataset.previousTotal)})
            </p>
          </div>

          <div className="bg-[#eceef0] p-1 rounded-lg flex items-center">
            {GRANULARITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setGranularity(option.value)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                  granularity === option.value
                    ? "bg-white text-[#006397] shadow-sm"
                    : "text-[#44474c] hover:text-[#041627]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 h-[320px] w-full relative">
          <div className="absolute inset-0 flex flex-col justify-between opacity-40 pointer-events-none">
            <div className="w-full border-b border-[#e6e8ea]" />
            <div className="w-full border-b border-[#e6e8ea]" />
            <div className="w-full border-b border-[#e6e8ea]" />
            <div className="w-full border-b border-[#e6e8ea]" />
          </div>
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 300" preserveAspectRatio="none">
            <defs>
              <linearGradient id="vendasChartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#006397" stopOpacity="0.15" />
                <stop offset="95%" stopColor="#006397" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={dataset.previousPath} fill="none" stroke="#c4c6cd" strokeDasharray="4" strokeWidth="2" />
            <path
              d={`${dataset.currentPath} L1000,300 L0,300 Z`}
              fill="url(#vendasChartGradient)"
              stroke="none"
            />
            <path d={dataset.currentPath} fill="none" stroke="#006397" strokeLinecap="round" strokeWidth="4" />
          </svg>
          <div className="flex justify-between mt-4 px-1 text-[11px] text-[#8192a7] font-medium uppercase tracking-tight">
            {dataset.points.map((point) => (
              <span key={point.label}>{point.label}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#006397] rounded-full" />
            <span className="text-xs text-[#44474c]">Período atual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#c4c6cd] rounded-full border-2 border-dashed border-white" />
            <span className="text-xs text-[#44474c]">Período anterior</span>
          </div>
        </div>
      </section>

      {/* Summary stats grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="stars"
          label={dataset.stats.bestLabel}
          value={formatCurrency(dataset.stats.bestValue)}
          hint={dataset.stats.bestPeriodLabel}
        />
        <StatCard
          icon="analytics"
          label={dataset.stats.averageLabel}
          value={formatCurrency(dataset.stats.averageValue)}
          hint="Média do período selecionado"
        />
        <StatCard
          icon="receipt_long"
          label="Total de Transações"
          value={dataset.stats.totalOrders.toLocaleString("pt-BR")}
          hint="Pedidos concluídos"
        />
        <StatCard
          icon="payments"
          label="Ticket Médio"
          value={formatCurrency(dataset.stats.averageTicket)}
          hint="Por transação única"
        />
      </section>

      {/* Data table */}
      <section className="bg-white rounded-xl shadow-card border border-[#e6e8ea] overflow-hidden">
        <div className="px-8 py-6 border-b border-[#e6e8ea] flex justify-between items-center">
          <h3 className="font-bold text-[#041627]">Detalhamento por Período</h3>
          <div className="flex gap-2">
            <button className="p-2 text-[#8192a7] hover:text-[#44474c] border border-[#e6e8ea] rounded-md transition-colors">
              <span className="material-symbols-outlined text-sm">download</span>
            </button>
            <button className="p-2 text-[#8192a7] hover:text-[#44474c] border border-[#e6e8ea] rounded-md transition-colors">
              <span className="material-symbols-outlined text-sm">print</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f7f9fb]">
              <tr>
                <th className="px-8 py-4 text-[11px] font-bold text-[#8192a7] uppercase tracking-widest">
                  Data / Período
                </th>
                <th className="px-8 py-4 text-[11px] font-bold text-[#8192a7] uppercase tracking-widest">
                  Valor Vendido
                </th>
                <th className="px-8 py-4 text-[11px] font-bold text-[#8192a7] uppercase tracking-widest text-center">
                  Nº de Pedidos
                </th>
                <th className="px-8 py-4 text-[11px] font-bold text-[#8192a7] uppercase tracking-widest text-right">
                  Variação %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e8ea]">
              {dataset.points.map((point) => {
                const isBest = point.label === bestPoint.label;
                const isUp = point.variation > 0;
                const isFlat = point.variation === 0;
                return (
                  <tr
                    key={point.label}
                    className={
                      isBest
                        ? "bg-[#006397]/5 hover:bg-[#006397]/10 transition-colors border-l-4 border-[#006397]"
                        : "hover:bg-[#f7f9fb] transition-colors"
                    }
                  >
                    <td className="px-8 py-4 font-semibold text-[#041627]">
                      {point.label}
                      {isBest && <span className="text-[#006397] font-normal"> (Pico)</span>}
                    </td>
                    <td className={`px-8 py-4 font-bold ${isBest ? "text-[#006397]" : "text-[#041627]"}`}>
                      {formatCurrency(point.value)}
                    </td>
                    <td className="px-8 py-4 text-center text-[#44474c]">
                      {point.orders.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span
                        className={`font-bold flex items-center justify-end gap-1 ${
                          isFlat ? "text-[#8192a7] font-medium" : isUp ? "text-emerald-600" : "text-[#ba1a1a]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {isFlat ? "horizontal_rule" : isUp ? "arrow_upward" : "arrow_downward"}
                        </span>
                        {Math.abs(point.variation).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-[#f7f9fb] border-t border-[#e6e8ea]">
          <p className="text-xs text-[#8192a7]">
            Mostrando dados consolidados para a visualização por {granularity === "mes" ? "mês" : granularity}.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, hint }: { icon: string; label: string; value: string; hint: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-card border border-[#e6e8ea] flex items-start gap-4 hover:border-[#c4c6cd] transition-all group">
      <div className="w-12 h-12 bg-[#006397]/10 rounded-lg flex items-center justify-center text-[#006397] group-hover:bg-[#006397] group-hover:text-white transition-colors shrink-0">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-semibold text-[#8192a7] mb-1 uppercase tracking-wider">{label}</p>
        <h4 className="text-xl font-bold text-[#041627]">{value}</h4>
        <p className="text-[10px] text-[#8192a7] mt-1">{hint}</p>
      </div>
    </div>
  );
}

export default VendasTotaisPage;
