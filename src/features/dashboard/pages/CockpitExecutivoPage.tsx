import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useSalesCockpit } from "../hooks/useSalesCockpit";
import type { SalesCockpitOrder } from "../types/salesCockpit";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

function formatCurrency(value: number | undefined, loading: boolean, error: string | null): string {
  if (loading) return "Carregando...";
  if (error || value === undefined) return "—";
  return currencyFormatter.format(value);
}

function CockpitExecutivoPage() {
  const { data, loading, error } = useSalesCockpit();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const stages = [
    { label: "Cotações Emitidas", count: data?.customerQuotations ?? 0, color: "bg-emerald-500" },
    { label: "Pedidos", count: data?.customerOrders ?? 0, color: "bg-amber-500" },
    { label: "Notas Fiscais Emitidas", count: data?.invoices ?? 0, color: "bg-blue-500" },
  ];
  const maxStageCount = Math.max(...stages.map((stage) => stage.count), 1);
  const conversionRate =
    data && data.customerQuotations > 0
      ? (data.invoices / data.customerQuotations) * 100
      : null;

  useEffect(() => {
    if (!toastMessage) return;

    const timeoutId = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-fg-strong">Cockpit Executivo & Funil de Vendas</h2>
        <p className="mt-1 text-fg-subtle">Visão executiva de faturamento, conversão e pedidos em andamento.</p>
      </div>

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-6 top-6 z-50 flex w-[min(26rem,calc(100vw-3rem))] items-start gap-4 rounded-2xl border-2 border-amber-500 bg-card p-5 text-fg-strong shadow-2xl"
        >
          <span className="material-symbols-outlined rounded-full bg-amber-100 p-2 text-3xl text-amber-700">
            info
          </span>
          <div className="pt-1">
            <p className="text-base font-bold">Funcionalidade em desenvolvimento</p>
            <p className="mt-1 text-sm text-fg-muted">{toastMessage}</p>
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="mb-6 rounded-xl border border-danger-line bg-danger-soft p-4 text-sm text-danger-ink">
          {error}
        </div>
      )}

      <section className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon="payments"
          iconClass="bg-blue-50 text-blue-600"
          badge="Total no mês"
          badgeClass="bg-surface-2 text-fg-muted"
          title="Faturamento Mensal"
          value={formatCurrency(data?.monthlySalesTotal, loading, error)}
        />
        <MetricCard
          icon="percent"
          iconClass="bg-purple-50 text-purple-600"
          badge="Média real"
          badgeClass="bg-surface-2 text-fg-muted"
          title="Markup Médio Real"
          value={loading ? "Carregando..." : error || !data ? "—" : `${data.averageMarkup.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`}
        />
        <MetricCard
          icon="bolt"
          iconClass="bg-amber-50 text-amber-600"
          badge={`${numberFormatter.format(data?.invoices ?? 0)} NF-e`}
          badgeClass="bg-surface-2 text-fg-muted"
          title="Pedidos no Período"
          value={loading ? "Carregando..." : error || !data ? "—" : numberFormatter.format(data.customerOrders)}
        />
        <MetricCard
          icon="warning"
          iconClass="bg-red-50 text-red-600"
          badge={
            loading
              ? "Carregando..."
              : error || !data
                ? "—"
                : `${numberFormatter.format(data.unpaidInvoicesCount)} faturas`
          }
          badgeClass="bg-red-50 text-red-600"
          title="Inadimplência Total"
          value={formatCurrency(data?.unpaidInvoicesAmount, loading, error)}
          detail={
          data && !loading && !error ? (
            <>
              <p>Recebido no mês: {currencyFormatter.format(data.amountReceivedThisMonth)}</p>
              <p>Previsto a receber: {currencyFormatter.format(data.amountToReceiveThisMonth)}</p>
              <p>Em aberto no mês: {currencyFormatter.format(data.amountDueThisMonth)}</p>
            </>
          ) : undefined
          }
          valueClass="text-red-600"
        />
      </section>

      <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-line bg-card p-6 shadow-card lg:col-span-2">
          <h3 className="mb-6 flex items-center gap-2 text-base font-bold text-fg-strong">
            <span className="material-symbols-outlined text-lg text-emerald-600">trending_up</span>
            Funil de Conversão de Vendas
          </h3>
          {loading ? (
            <p className="py-12 text-center text-sm text-fg-subtle">Carregando etapas do funil...</p>
          ) : error ? (
            <p className="py-12 text-center text-sm text-fg-subtle">Não foi possível carregar o funil.</p>
          ) : (
            <div className="space-y-4 px-1 sm:px-8">
              {stages.map((stage) => {
                return (
                  <div
                    key={stage.label}
                    className="relative mx-auto flex h-16 w-full items-center justify-between overflow-hidden rounded-xl border border-line bg-canvas px-4 shadow-sm sm:px-6"
                  >
                    <span
                      className={`absolute inset-y-0 left-0 opacity-15 ${stage.color}`}
                      style={{ width: `${(stage.count / maxStageCount) * 100}%` }}
                    />
                    <span className="relative z-10 text-xs font-medium text-fg-strong sm:text-sm">{stage.label}</span>
                    <span className="relative z-10 text-xs font-bold text-fg-strong sm:text-base">
                      {numberFormatter.format(stage.count)}
                    </span>
                  </div>
                );
              })}
              <div className="mt-2 border-t border-line-soft pt-4 text-center">
                <div className="text-xs font-bold uppercase tracking-widest text-fg-subtle">
                  Cotações convertidas em NF-e
                </div>
                <div className="mt-0.5 text-3xl font-black text-fg-strong">
                  {conversionRate === null ? "—" : `${conversionRate.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`}
                </div>
              </div>
            </div>
          )}
        </article>

        <article className="flex flex-col rounded-2xl border border-line bg-card p-6 shadow-card">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-fg-strong">
            <span className="material-symbols-outlined text-lg text-fg-subtle">notifications</span>
            Alertas de Atenção
          </h3>
          <div className="flex flex-1 items-center justify-center rounded-xl border border-line bg-canvas p-5 text-center">
            <div>
              <span className="material-symbols-outlined text-3xl text-fg-subtle">info</span>
              <p className="mt-2 text-sm font-semibold text-fg-strong">Alertas operacionais indisponíveis</p>
              <p className="mt-1 text-xs text-fg-subtle">
                A API ainda não fornece dados de bloqueio financeiro ou ruptura de estoque.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-fg-strong">
              <span className="material-symbols-outlined text-lg text-emerald-600">bolt</span>
              Pedidos em Andamento & Status Delphi
            </h3>
            <p className="mt-0.5 text-xs text-fg-subtle">Pedidos recentes sincronizados com o sistema</p>
          </div>
          <div className="text-xs font-medium text-fg-subtle">
            {loading ? "Carregando pedidos..." : `Mostrando ${numberFormatter.format(data?.recentOrders.length ?? 0)} pedidos`}
          </div>
        </div>

        {error ? (
          <p className="py-10 text-center text-sm text-danger-fg">{error}</p>
        ) : loading ? (
          <p className="py-10 text-center text-sm text-fg-subtle">Carregando pedidos recentes...</p>
        ) : !data?.recentOrders.length ? (
          <p className="py-10 text-center text-sm text-fg-subtle">Nenhum pedido recente encontrado.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="border-b border-line bg-canvas text-fg-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nº Pedido</th>
                  <th className="px-4 py-3 font-semibold">Data</th>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Vendedor</th>
                  <th className="px-4 py-3 text-right font-semibold">Valor Total</th>
                  <th className="px-4 py-3 text-right font-semibold">Markup</th>
                  <th className="px-4 py-3 font-semibold">Status Operacional</th>
                  <th className="px-4 py-3 text-right font-semibold">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {data.recentOrders.map((order, index) => (
                  <tr key={`${order.orderNumber}-${index}`} className="transition hover:bg-canvas">
                    <td className="px-4 py-3 font-mono font-bold text-accent">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-fg-muted">
                      {new Date(`${order.orderDate}T00:00:00`).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 font-medium text-fg">
                      {order.customerName.trim() || `Cliente ${order.customerCode}`}
                    </td>
                    <td className="px-4 py-3 font-medium text-fg-muted">{order.salesmanName?.trim() || "—"}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-fg">
                      {currencyFormatter.format(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-fg">
                      {order.averageMarkup.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {order.status.startsWith("Aguardando") && (
                        <button
                          type="button"
                          onClick={() => setToastMessage("Esta funcionalidade ainda não foi adicionada.")}
                          className="whitespace-nowrap rounded-lg border border-amber-500 bg-amber-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:border-amber-600 hover:bg-amber-600"
                        >
                          Solicitar ação
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  iconClass,
  badge,
  badgeClass,
  title,
  value,
  valueClass = "text-fg-strong",
  detail,
}: {
  icon: string;
  iconClass: string;
  badge: string;
  badgeClass: string;
  title: string;
  value: string;
  valueClass?: string;
  detail?: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-line bg-card p-6 shadow-card">
      <div className="mb-4 flex items-start justify-between gap-2">
        <span className={`material-symbols-outlined rounded-lg p-2 ${iconClass}`}>{icon}</span>
        <span className={`rounded px-2 py-1 text-xs font-bold ${badgeClass}`}>{badge}</span>
      </div>
      <div className="text-sm font-medium text-fg-subtle">{title}</div>
      <div className={`mt-1 text-2xl font-bold ${valueClass}`}>{value}</div>
      {detail && <div className="mt-3 space-y-1 text-[11px] text-fg-subtle">{detail}</div>}
    </article>
  );
}

function statusClass(status: SalesCockpitOrder["status"]): string {
  const normalized = status.toLocaleLowerCase("pt-BR");
  if (normalized.includes("faturado")) return "border-emerald-300 bg-emerald-100 text-emerald-800";
  if (normalized.includes("financeiro")) return "border-amber-300 bg-amber-100 text-amber-800";
  if (normalized.includes("estoque")) return "border-purple-300 bg-purple-100 text-purple-800";
  if (normalized.includes("pronto")) return "border-blue-300 bg-blue-100 text-blue-800";
  return "border-line bg-surface-2 text-fg-muted";
}

export default CockpitExecutivoPage;
