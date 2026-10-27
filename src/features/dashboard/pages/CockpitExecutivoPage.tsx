import { useEffect, useState } from "react";
import { cockpitOrders, type CockpitOrder } from "../data/cockpitOrders";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const funnelStages = [
  { label: "Cotações Emitidas", count: "184 cotações", value: "R$ 3.840.000", width: "100%", color: "bg-emerald-500" },
  { label: "Pedidos Aprovados", count: "122 pedidos", value: "R$ 1.920.000", width: "82%", color: "bg-amber-500" },
  { label: "Notas Fiscais Emitidas", count: "88 NF-e", value: "R$ 1.250.400", width: "64%", color: "bg-blue-500" },
];

function CockpitExecutivoPage() {
  const [selectedOrder, setSelectedOrder] = useState<CockpitOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-emerald-500 bg-ink-solid px-4 py-3 text-white shadow-xl"
        >
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      <section className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon="payments"
          iconClass="bg-blue-50 text-blue-600"
          badge="+12.4%"
          badgeClass="bg-emerald-50 text-emerald-600"
          title="Faturamento Mensal"
          value="R$ 1.250.400"
        />
        <MetricCard
          icon="percent"
          iconClass="bg-purple-50 text-purple-600"
          badge="Meta: 120%"
          badgeClass="bg-emerald-50 text-emerald-600"
          title="Markup Médio Real"
          value="148,2%"
          valueClass="text-emerald-600"
        />
        <MetricCard
          icon="bolt"
          iconClass="bg-amber-50 text-amber-600"
          badge="64 Pedidos"
          badgeClass="bg-surface-2 text-fg-muted"
          title="Pipeline Faturamento"
          value="R$ 450.000"
        />
        <MetricCard
          icon="warning"
          iconClass="bg-red-50 text-red-600"
          badge="Crítico"
          badgeClass="bg-red-50 text-red-600"
          title="Inadimplência Total"
          value="4,2%"
          valueClass="text-red-600"
        />
      </section>

      <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-line bg-card p-6 shadow-card lg:col-span-2">
          <h3 className="mb-6 flex items-center gap-2 text-base font-bold text-fg-strong">
            <span className="material-symbols-outlined text-lg text-emerald-600">trending_up</span>
            Funil de Conversão de Vendas
          </h3>
          <div className="space-y-4 px-1 sm:px-8">
            {funnelStages.map((stage, index) => (
              <div
                key={stage.label}
                className={`relative mx-auto flex h-16 items-center justify-between overflow-hidden px-4 text-white shadow-sm sm:px-6 ${
                  index === 0
                    ? "w-full rounded-t-xl bg-ink-solid"
                    : index === 1
                      ? "w-[82%] rounded-md bg-ink-2"
                      : "w-[64%] rounded-b-xl bg-ink-3"
                }`}
              >
                <span className={`absolute inset-0 opacity-20 ${stage.color}`} />
                <span className="relative z-10 text-xs font-medium sm:text-sm">
                  {stage.label} ({stage.count})
                </span>
                <span className="relative z-10 text-xs font-bold sm:text-base">{stage.value}</span>
              </div>
            ))}
            <div className="mt-2 border-t border-line-soft pt-4 text-center">
              <div className="text-xs font-bold uppercase tracking-widest text-fg-subtle">
                Eficiência de Conversão Total
              </div>
              <div className="mt-0.5 text-3xl font-black text-fg-strong">32.6%</div>
            </div>
          </div>
        </article>

        <article className="flex flex-col rounded-2xl border border-line bg-card p-6 shadow-card">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-fg-strong">
            <span className="material-symbols-outlined text-lg text-amber-500">gpp_maybe</span>
            Alertas de Atenção
          </h3>
          <div className="flex flex-1 flex-col gap-3.5">
            <AlertCard
              kind="amber"
              title="Bloqueio Financeiro"
              primary="Pedido #9842 - R$ 42.500"
              detail="Vendedor: JULIA_VENDAS • Limite Excedido"
            />
            <AlertCard
              kind="red"
              title="Ruptura de Estoque"
              primary="Cabo XLR 10m - 0 unidades"
              detail="8 pedidos aguardando reposição"
            />
            <AlertCard
              kind="blue"
              title="Inadimplência Alta"
              primary="CABLE CONNECT LTDA"
              detail="R$ 15.200 atrasados há 45 dias"
            />
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
            <p className="mt-0.5 text-xs text-fg-subtle">
              Pedidos sincronizados em tempo real com controle de margem e cobrança
            </p>
          </div>
          <div className="text-xs font-medium text-fg-subtle">Mostrando {cockpitOrders.length} pedidos</div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead className="border-b border-line bg-canvas text-fg-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Nº Pedido</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Vendedor</th>
                <th className="px-4 py-3 text-right font-semibold">Valor Total</th>
                <th className="px-4 py-3 text-right font-semibold">Markup</th>
                <th className="px-4 py-3 font-semibold">Status Operacional</th>
                <th className="px-4 py-3 text-right font-semibold">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {cockpitOrders.map((order) => (
                <tr
                  key={order.id}
                  tabIndex={0}
                  onClick={() => setSelectedOrder(order)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedOrder(order);
                    }
                  }}
                  className="cursor-pointer transition hover:bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <td className="px-4 py-3 font-mono font-bold text-accent">{order.id}</td>
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-fg">
                    {order.client}
                    <div className="text-[10px] text-fg-subtle">
                      {order.city} - {order.uf}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-fg-muted">{order.seller}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-fg">
                    {currencyFormatter.format(order.totalValue)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    <span className={order.markup >= 145 ? "text-emerald-600" : "text-amber-600"}>
                      {order.markup.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(event) => event.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {order.status === "Aguardando Financeiro" && (
                        <button
                          type="button"
                          onClick={() =>
                            setToastMessage(
                              `Notificação disparada para o vendedor ${order.seller} sobre o pedido ${order.id}!`
                            )
                          }
                          className="rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-amber-600"
                        >
                          Cobrar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-lg p-1.5 text-fg-subtle transition hover:bg-surface-2 hover:text-accent"
                        aria-label={`Ver detalhes do pedido ${order.id}`}
                      >
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedOrder && (
        <OrderDetailsDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
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
}: {
  icon: string;
  iconClass: string;
  badge: string;
  badgeClass: string;
  title: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <article className="rounded-2xl border border-line bg-card p-6 shadow-card">
      <div className="mb-4 flex items-start justify-between gap-2">
        <span className={`material-symbols-outlined rounded-lg p-2 ${iconClass}`}>{icon}</span>
        <span className={`rounded px-2 py-1 text-xs font-bold ${badgeClass}`}>{badge}</span>
      </div>
      <div className="text-sm font-medium text-fg-subtle">{title}</div>
      <div className={`mt-1 text-2xl font-bold ${valueClass}`}>{value}</div>
    </article>
  );
}

function AlertCard({
  kind,
  title,
  primary,
  detail,
}: {
  kind: "amber" | "red" | "blue";
  title: string;
  primary: string;
  detail: string;
}) {
  const colorClasses = {
    amber: "border-amber-500 bg-amber-50 text-amber-700",
    red: "border-red-500 bg-red-50 text-red-700",
    blue: "border-blue-500 bg-blue-50 text-blue-700",
  }[kind];

  return (
    <div className={`rounded-r-lg border-l-4 p-4 ${colorClasses}`}>
      <div className="mb-1 text-xs font-bold uppercase">{title}</div>
      <div className="text-sm font-semibold text-fg">{primary}</div>
      <div className="mt-1 text-xs text-fg-subtle">{detail}</div>
    </div>
  );
}

function statusClass(status: CockpitOrder["status"]): string {
  switch (status) {
    case "Faturado":
      return "border-emerald-300 bg-emerald-100 text-emerald-800";
    case "Pronto para Faturar":
      return "border-blue-300 bg-blue-100 text-blue-800";
    case "Aguardando Financeiro":
      return "border-amber-300 bg-amber-100 text-amber-800";
    case "Aguardando Estoque":
      return "border-purple-300 bg-purple-100 text-purple-800";
  }
}

function OrderDetailsDrawer({ order, onClose }: { order: CockpitOrder; onClose: () => void }) {
  const items =
    order.items.length > 0
      ? order.items
      : [{ name: "Itens diversos do pedido", qty: order.itemsCount, unitPrice: order.totalValue / order.itemsCount }];

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-ink-solid/50"
        onClick={onClose}
        aria-label="Fechar detalhes do pedido"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cockpit-order-title"
        className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-line bg-card shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-line bg-canvas p-5">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded border border-accent-soft bg-accent-tint px-2 py-0.5 font-mono text-xs font-bold text-accent">
                {order.id}
              </span>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass(order.status)}`}>
                {order.status}
              </span>
            </div>
            <h2 id="cockpit-order-title" className="text-base font-bold text-fg-strong">
              {order.client}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-fg-subtle transition hover:bg-surface-2 hover:text-fg-strong"
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <DetailMetric title="Valor Total" value={currencyFormatter.format(order.totalValue)} />
            <DetailMetric title="Markup Praticado" value={`${order.markup.toFixed(2)}%`} />
            <DetailMetric title="Condição Pgto" value={order.paymentTerms} />
            <DetailMetric title="Vendedor" value={order.seller} />
          </div>

          <section className="space-y-3 rounded-xl border border-line p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-fg-subtle">
              Dados do Cliente & Logística
            </h3>
            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <DetailField label="CNPJ" value={order.clientDoc} />
              <DetailField label="Destino" value={`${order.city} - ${order.uf}`} />
              <DetailField label="Transportadora" value={order.carrier || "A DEFINIR"} />
              <DetailField label="Emissão Pedido" value={order.date} />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-fg-subtle">
              Itens do Pedido ({order.itemsCount} itens)
            </h3>
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[440px] text-left text-xs">
                <thead className="bg-canvas text-fg-muted">
                  <tr>
                    <th className="px-3 py-2.5 font-semibold">Produto</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Qtd</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Preço Unit.</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {items.map((item) => (
                    <tr key={item.name}>
                      <td className="px-3 py-2.5 font-medium">{item.name}</td>
                      <td className="px-3 py-2.5 text-right">{item.qty} un</td>
                      <td className="px-3 py-2.5 text-right">{currencyFormatter.format(item.unitPrice)}</td>
                      <td className="px-3 py-2.5 text-right font-bold">
                        {currencyFormatter.format(item.qty * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="space-y-2 rounded-xl border border-line bg-canvas p-4 text-xs">
            <div className="flex justify-between text-fg-muted">
              <span>Subtotal dos Produtos:</span>
              <span className="font-semibold">{currencyFormatter.format(order.totalValue * 0.92)}</span>
            </div>
            <div className="flex justify-between text-fg-muted">
              <span>ICMS ST / Tributos Retidos (NF-e):</span>
              <span className="font-semibold">{currencyFormatter.format(order.totalValue * 0.08)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-sm font-bold text-fg-strong">
              <span>Total com Impostos:</span>
              <span className="text-accent">{currencyFormatter.format(order.totalValue)}</span>
            </div>
          </div>
        </div>

        <footer className="flex justify-end border-t border-line p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl bg-accent-solid px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-solid-hover"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Liberar p/ Próxima Fase
          </button>
        </footer>
      </aside>
    </div>
  );
}

function DetailMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-line bg-canvas p-3">
      <div className="text-[11px] font-medium text-fg-subtle">{title}</div>
      <div className="truncate text-sm font-bold text-fg-strong">{value}</div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-fg-subtle">{label}: </span>
      <span className="font-medium text-fg-muted">{value}</span>
    </div>
  );
}

export default CockpitExecutivoPage;
