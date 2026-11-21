import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useConsultaDiaria } from "../hooks/useConsultaDiaria";
import {
  reorderConsultaDiariaWidgets,
  useConsultaDiariaLayout,
  type ConsultaDiariaColumnSpan,
  type ConsultaDiariaWidgetId,
  type ConsultaDiariaWidgetLayout,
} from "../hooks/useConsultaDiariaLayout";
import { formatCurrency, formatNumber, formatPercent, formatPosition } from "../utils/format";
import PresentationText from "../components/PresentationText";

const COLUMN_SPAN_CLASSES: Record<ConsultaDiariaColumnSpan, string> = {
  4: "xl:col-span-4",
  5: "xl:col-span-5",
  6: "xl:col-span-6",
  7: "xl:col-span-7",
  8: "xl:col-span-8",
  9: "xl:col-span-9",
  10: "xl:col-span-10",
  11: "xl:col-span-11",
  12: "xl:col-span-12",
};

function SectionCard({
  widgetId,
  layout,
  order,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onResize,
  isDraggingToDrop,
  title,
  description,
  children,
}: {
  widgetId: ConsultaDiariaWidgetId;
  layout: ConsultaDiariaWidgetLayout;
  order: number;
  onDragStart: (id: ConsultaDiariaWidgetId) => void;
  onDragOver: (id: ConsultaDiariaWidgetId) => void;
  onDragEnd: () => void;
  onDrop: (sourceId: string, targetId: ConsultaDiariaWidgetId) => void;
  onResize: (
    id: ConsultaDiariaWidgetId,
    changes: Partial<Omit<ConsultaDiariaWidgetLayout, "id">>
  ) => void;
  isDraggingToDrop: boolean;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const resizeStart = useRef<{
    clientX: number;
    clientY: number;
    height: number;
    columnSpan: ConsultaDiariaColumnSpan;
    columnPitch: number;
    columnCount: number;
  } | null>(null);

  function startResize(event: ReactPointerEvent<HTMLButtonElement>) {
    const grid = event.currentTarget.closest<HTMLElement>("[data-widget-grid]");
    if (!grid) return;

    const gridStyle = window.getComputedStyle(grid);
    const columnCount = gridStyle.gridTemplateColumns.split(" ").length;
    const columnGap = Number.parseFloat(gridStyle.columnGap) || 0;
    const columnWidth = (grid.clientWidth - columnGap * (columnCount - 1)) / columnCount;
    resizeStart.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      height: layout.height,
      columnSpan: layout.columnSpan,
      columnPitch: columnWidth + columnGap,
      columnCount,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function resize(event: ReactPointerEvent<HTMLButtonElement>) {
    const start = resizeStart.current;
    if (!start) return;

    const columnSpan = start.columnCount > 1
      ? Math.max(
          4,
          Math.min(12, Math.round(start.columnSpan + (event.clientX - start.clientX) / start.columnPitch))
        ) as ConsultaDiariaColumnSpan
      : start.columnSpan;
    const height = Math.max(
      280,
      Math.min(720, Math.round((start.height + event.clientY - start.clientY) / 10) * 10)
    );
    onResize(widgetId, { columnSpan, height });
  }

  function finishResize() {
    resizeStart.current = null;
  }

  return (
    <section
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDragEnter={() => {
        onDragOver(widgetId);
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(event.dataTransfer.getData("text/plain"), widgetId);
      }}
      style={{ height: `${layout.height}px`, order }}
      className={`relative col-span-1 flex min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-card shadow-card ${COLUMN_SPAN_CLASSES[layout.columnSpan]} ${isDraggingToDrop ? "hidden" : ""}`}
    >
      <div
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData("text/plain", widgetId);
          event.dataTransfer.effectAllowed = "move";
          onDragStart(widgetId);
        }}
        onDragEnd={onDragEnd}
        className="flex cursor-grab flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3 active:cursor-grabbing sm:px-5"
      >
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-fg-strong">{title}</h3>
          <p className="mt-1 text-xs text-fg-subtle">{description}</p>
        </div>
        <div className="flex shrink-0 items-center justify-end">
          <button
            type="button"
            draggable
            tabIndex={-1}
            title="Arraste para reorganizar"
            aria-label={`Arrastar para reorganizar o quadro ${title}`}
            className="flex h-8 w-8 cursor-grab items-center justify-center rounded-md text-fg-muted hover:bg-surface-2"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">drag_indicator</span>
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      <button
        type="button"
        aria-label={`Redimensionar largura e altura do quadro ${title}`}
        onPointerDown={startResize}
        onPointerMove={resize}
        onPointerUp={finishResize}
        onPointerCancel={finishResize}
        className="absolute bottom-0 right-0 z-10 flex h-6 w-6 cursor-nwse-resize touch-none items-end justify-end rounded-tl-md bg-transparent p-0.5 text-fg-muted transition-colors hover:bg-accent-solid/20 hover:text-accent active:bg-accent-solid/40"
      >
        <span className="material-symbols-outlined rotate-[-45deg] text-sm" aria-hidden="true">
          drag_handle
        </span>
      </button>
    </section>
  );
}

function ConsultaDiariaPage() {
  const { widgets, moveWidgetBefore, resizeWidget, resetLayout } = useConsultaDiariaLayout();
  const { data, loading, error, refetch } = useConsultaDiaria();
  const [draggedWidgetId, setDraggedWidgetId] = useState<ConsultaDiariaWidgetId | null>(null);
  const [dropTargetId, setDropTargetId] = useState<ConsultaDiariaWidgetId | null>(null);
  const topProducts = data?.topSoldItems ?? [];
  const topCustomers = data?.topCustomers ?? [];
  const revenueByState = data?.salesByUf ?? [];
  const sellerPortfolios = data?.salespeople ?? [];
  const sellerDailyRevenue = data?.salespersonTotals ?? [];
  const isShowingDropPreview = Boolean(
    draggedWidgetId && dropTargetId && draggedWidgetId !== dropTargetId
  );
  const previewWidgets = isShowingDropPreview && draggedWidgetId && dropTargetId
    ? reorderConsultaDiariaWidgets(widgets, draggedWidgetId, dropTargetId)
    : widgets;
  const draggedWidget = draggedWidgetId
    ? widgets.find((widget) => widget.id === draggedWidgetId)
    : undefined;
  const placeholderOrder = draggedWidgetId
    ? previewWidgets.findIndex((widget) => widget.id === draggedWidgetId)
    : -1;

  function finishDrop(sourceId: string, targetId: ConsultaDiariaWidgetId) {
    moveWidgetBefore(sourceId, targetId);
    setDraggedWidgetId(null);
    setDropTargetId(null);
  }

  function finishDrag() {
    setDraggedWidgetId(null);
    setDropTargetId(null);
  }

  function handleDragOver(widgetId: ConsultaDiariaWidgetId) {
    setDropTargetId(widgetId === draggedWidgetId ? null : widgetId);
  }

  function getWidgetProps(widgetId: ConsultaDiariaWidgetId) {
    const layout = widgets.find((widget) => widget.id === widgetId);
    if (!layout) throw new Error(`Layout ausente para o quadro "${widgetId}".`);
    return {
      widgetId,
      layout,
      order: previewWidgets.findIndex((widget) => widget.id === widgetId),
      isDraggingToDrop: isShowingDropPreview && widgetId === draggedWidgetId,
      onDragStart: setDraggedWidgetId,
      onDragOver: handleDragOver,
      onDragEnd: finishDrag,
      onDrop: finishDrop,
      onResize: resizeWidget,
    };
  }

  const revenueByStateTotal = revenueByState.reduce((total, item) => total + item.amount, 0);
  const dailyTotals = sellerDailyRevenue.reduce(
    (totals, seller) => ({
      billed: totals.billed + seller.totalFaturado,
      commission: totals.commission + seller.totalComissao,
      withoutInvoice: totals.withoutInvoice + seller.totalSemNota,
      expenses: totals.expenses + seller.totalDespesas,
      costs: totals.costs + seller.custosTotais,
      icms: totals.icms + seller.totalIcms,
    }),
    { billed: 0, commission: 0, withoutInvoice: 0, expenses: 0, costs: 0, icms: 0 }
  );
  const portfolioTotals = sellerPortfolios.reduce(
    (totals, item) => ({
      customers: totals.customers + item.clientesResponsaveis,
      attended: totals.attended + item.clientesComCompra,
    }),
    { customers: 0, attended: 0 }
  );
  const attendanceRate = portfolioTotals.customers
    ? (portfolioTotals.attended / portfolioTotals.customers) * 100
    : 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-fg-strong">Consulta diária gerencial</h2>
          </div>
          <p className="text-sm text-fg-subtle">
            Visão consolidada de produtos, clientes, cobertura comercial e resultado por vendedor.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-xs text-fg-muted">
            <span className="material-symbols-outlined text-base text-accent" aria-hidden="true">calendar_today</span>
            <span>Consulta diária</span>
          </div>
          <button
            type="button"
            onClick={resetLayout}
            className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-fg-muted transition hover:bg-surface-2"
          >
            <span className="material-symbols-outlined text-sm" aria-hidden="true">restart_alt</span>
            Restaurar layout original
          </button>
        </div>
      </header>
      <p className="-mt-3 text-xs text-fg-subtle">
        Arraste pelo cabeçalho para reorganizar, use a quina inferior direita para redimensionar e restaure o layout original quando quiser.
      </p>

      {loading ? (
        <p role="status" className="rounded-xl border border-line bg-card p-6 text-sm text-fg-subtle">
          Carregando resumo gerencial...
        </p>
      ) : error || !data ? (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          <span>{error ?? "Não foi possível carregar o resumo gerencial."}</span>
          <button
            type="button"
            onClick={refetch}
            className="rounded-md border border-red-300 px-3 py-2 font-semibold transition hover:bg-red-100"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
      <>
      <section aria-label="Indicadores diários" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-line bg-card p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">Faturamento no período</p>
          <p className="mt-2 text-2xl font-bold text-fg-strong">{formatCurrency(dailyTotals.billed)}</p>
          <p className="mt-1 text-xs text-fg-subtle">Total consolidado por vendedor</p>
        </div>
        <div className="rounded-xl border border-line bg-card p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">Clientes atendidos</p>
          <p className="mt-2 text-2xl font-bold text-fg-strong">
            {formatNumber(portfolioTotals.attended)}
            <span className="ml-1 text-sm font-medium text-fg-subtle">/ {formatNumber(portfolioTotals.customers)}</span>
          </p>
          <p className="mt-1 text-xs text-fg-subtle">Cobertura da carteira: {formatPercent(attendanceRate)}</p>
        </div>
        <div className="rounded-xl border border-line bg-card p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">Comissões</p>
          <p className="mt-2 text-2xl font-bold text-fg-strong">{formatCurrency(dailyTotals.commission)}</p>
          <p className="mt-1 text-xs text-fg-subtle">Total consolidado por vendedor</p>
        </div>
        <div className="rounded-xl border border-line bg-card p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">ICMS total</p>
          <p className="mt-2 text-2xl font-bold text-fg-strong">{formatCurrency(dailyTotals.icms)}</p>
          <p className="mt-1 text-xs text-fg-subtle">Somatório por vendedor</p>
        </div>
      </section>

      <div data-widget-grid className="grid grid-flow-row-dense grid-cols-1 gap-6 xl:grid-cols-12">
        <SectionCard
          {...getWidgetProps("products")}
          title="Curva ABC de produtos"
          description="Produtos mais vendidos por quantidade • a API não retorna a classe ABC"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-canvas">
                <tr className="text-[10px] uppercase tracking-wider text-fg-subtle">
                  <th className="px-5 py-3 font-bold">Posição</th>
                  <th className="px-3 py-3 font-bold">Código</th>
                  <th className="px-3 py-3 font-bold">Descrição</th>
                  <th className="px-5 py-3 text-right font-bold">Quantidade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {topProducts.map((product, index) => (
                  <tr key={`${product.codigoGrupo}-${product.codigoSubGrupo}-${product.codigoProduto}`} className="text-fg-muted">
                    <td className="whitespace-nowrap px-5 py-3 font-semibold text-fg-strong">{formatPosition(index + 1)}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-mono text-xs">
                      <PresentationText alwaysVisible>{[product.codigoGrupo, product.codigoSubGrupo, product.codigoProduto].join(".")}</PresentationText>
                    </td>
                    <td className="px-3 py-3 font-medium text-fg-strong"><PresentationText>{product.descricaoItemLiberacao.trim()}</PresentationText></td>
                    <td className="whitespace-nowrap px-5 py-3 text-right font-semibold text-fg-strong">
                      {formatNumber(product.totalSeparado)} un.
                    </td>
                  </tr>
                ))}
                {topProducts.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-6 text-center text-sm text-fg-subtle">Nenhum produto no período.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          {...getWidgetProps("states")}
          title="Faturamento por estado"
          description="Participação de cada estado no faturamento total"
        >
          <div className="divide-y divide-line px-5">
            {revenueByState.map((item) => {
              return (
                <div key={item.uf} className="py-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="w-10 font-bold text-fg-strong"><PresentationText>{item.uf}</PresentationText></span>
                    <span className="flex-1 text-right font-medium text-fg-strong">{formatCurrency(item.amount)}</span>
                    <span className="w-14 text-right text-xs text-fg-subtle">{formatPercent(item.representationPercentage)}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-accent-solid" style={{ width: `${item.representationPercentage}%` }} />
                  </div>
                </div>
              );
            })}
            {revenueByState.length === 0 && (
              <p className="py-6 text-center text-sm text-fg-subtle">Nenhum faturamento por estado no período.</p>
            )}
            <div className="flex justify-between py-3 text-sm font-bold text-fg-strong">
              <span>Total</span>
              <span>{formatCurrency(revenueByStateTotal)}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          {...getWidgetProps("customers")}
          title="Curva ABC de clientes"
          description="Clientes ordenados por total faturado • a API não retorna a classe ABC"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-left text-sm">
              <thead className="bg-canvas">
                <tr className="text-[10px] uppercase tracking-wider text-fg-subtle">
                  <th className="px-5 py-3 font-bold">Posição</th>
                  <th className="px-3 py-3 font-bold">Cliente</th>
                  <th className="px-5 py-3 text-right font-bold">Total faturado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {topCustomers.map((customer, index) => (
                  <tr key={customer.codigoCliente} className="text-fg-muted">
                    <td className="whitespace-nowrap px-5 py-3 font-semibold text-fg-strong">{formatPosition(index + 1)}</td>
                    <td className="px-3 py-3 font-medium text-fg-strong"><PresentationText>{customer.nomeFantasia.trim()}</PresentationText></td>
                    <td className="whitespace-nowrap px-5 py-3 text-right font-semibold text-fg-strong">
                      {formatCurrency(customer.totalLiberadoComImpostos)}
                    </td>
                  </tr>
                ))}
                {topCustomers.length === 0 && (
                  <tr><td colSpan={3} className="px-5 py-6 text-center text-sm text-fg-subtle">Nenhum cliente no período.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          {...getWidgetProps("portfolio")}
          title="Carteira de clientes por vendedor"
          description="Cobertura de atendimento da carteira"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="bg-canvas">
                <tr className="text-[10px] uppercase tracking-wider text-fg-subtle">
                  <th className="px-5 py-3 font-bold">Vendedor</th>
                  <th className="px-3 py-3 text-right font-bold">Clientes</th>
                  <th className="px-3 py-3 text-right font-bold">Atendidos</th>
                  <th className="px-5 py-3 text-right font-bold">% atendido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sellerPortfolios.map((item) => {
                  return (
                    <tr key={item.codigoVendedor} className="text-fg-muted">
                      <td className="whitespace-nowrap px-5 py-3 font-medium text-fg-strong"><PresentationText>{item.nomeVendedor}</PresentationText></td>
                      <td className="px-3 py-3 text-right">{formatNumber(item.clientesResponsaveis)}</td>
                      <td className="px-3 py-3 text-right">{formatNumber(item.clientesComCompra)}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-right font-semibold text-fg-strong">
                        {formatPercent(item.representationPercentage)}
                      </td>
                    </tr>
                  );
                })}
                {sellerPortfolios.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-6 text-center text-sm text-fg-subtle">Nenhuma carteira de vendedor no período.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

      <SectionCard
        {...getWidgetProps("sellerDaily")}
        title="Resumo diário de faturamento por vendedor"
        description="Valores consolidados do período selecionado"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-canvas">
              <tr className="text-[10px] uppercase tracking-wider text-fg-subtle">
                <th className="px-5 py-3 font-bold">Vendedor</th>
                <th className="px-3 py-3 text-right font-bold">Total faturado</th>
                <th className="px-3 py-3 text-right font-bold">Comissão</th>
                <th className="px-3 py-3 text-right font-bold">Sem nota</th>
                <th className="px-3 py-3 text-right font-bold">Despesas</th>
                <th className="px-3 py-3 text-right font-bold">Custos</th>
                <th className="px-5 py-3 text-right font-bold">ICMS total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sellerDailyRevenue.map((item) => (
                <tr key={item.codigoVendedor} className="text-fg-muted">
                  <td className="whitespace-nowrap px-5 py-3 font-semibold text-fg-strong"><PresentationText>{item.nomeVendedor}</PresentationText></td>
                  <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-fg-strong">
                    {formatCurrency(item.totalFaturado)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">{formatCurrency(item.totalComissao)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">{formatCurrency(item.totalSemNota)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">{formatCurrency(item.totalDespesas)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">{formatCurrency(item.custosTotais)}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-right">{formatCurrency(item.totalIcms)}</td>
                </tr>
              ))}
              {sellerDailyRevenue.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-6 text-center text-sm text-fg-subtle">Nenhum faturamento por vendedor no período.</td></tr>
              )}
            </tbody>
            <tfoot className="border-t-2 border-line bg-canvas">
              <tr className="font-bold text-fg-strong">
                <td className="whitespace-nowrap px-5 py-3">Total geral</td>
                <td className="whitespace-nowrap px-3 py-3 text-right">{formatCurrency(dailyTotals.billed)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right">{formatCurrency(dailyTotals.commission)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right">{formatCurrency(dailyTotals.withoutInvoice)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right">{formatCurrency(dailyTotals.expenses)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right">{formatCurrency(dailyTotals.costs)}</td>
                <td className="whitespace-nowrap px-5 py-3 text-right">{formatCurrency(dailyTotals.icms)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>
      {isShowingDropPreview && draggedWidget && dropTargetId && (
        <div
          aria-hidden="true"
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
          }}
          onDrop={(event) => {
            event.preventDefault();
            finishDrop(event.dataTransfer.getData("text/plain"), dropTargetId);
          }}
          style={{ height: `${draggedWidget.height}px`, order: placeholderOrder }}
          className={`col-span-1 flex min-w-0 items-center justify-center rounded-xl border-2 border-dashed border-accent-solid bg-accent-solid/5 text-sm font-semibold text-accent ${COLUMN_SPAN_CLASSES[draggedWidget.columnSpan]}`}
        >
          <span className="material-symbols-outlined mr-2 text-lg" aria-hidden="true">
            move_down
          </span>
          Solte para posicionar
        </div>
      )}
      </div>
      </>
      )}
    </div>
  );
}

export default ConsultaDiariaPage;
