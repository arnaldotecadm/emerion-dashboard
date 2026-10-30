import { Link } from "react-router-dom";
import { formatCurrency } from "../data/clientesData";
import type { OverdueInvoice } from "../types/customerTopTrends";

interface DelinquencyRiskPanelProps {
  data: OverdueInvoice[];
  loading: boolean;
  error: string | null;
}

/** Panel listing overdue invoices returned by the customer dashboard API. */
function DelinquencyRiskPanel({ data, loading, error }: DelinquencyRiskPanelProps) {
  return (
    <div className="bg-card rounded-xl shadow-card border border-line flex flex-col h-full">
      <div className="p-6 border-b border-line">
        <h3 className="font-bold text-fg-strong text-lg flex items-center gap-2">
          Risco de Inadimplência
          <span className="w-2 h-2 bg-danger-solid rounded-full animate-pulse" />
        </h3>
      </div>
      <div className="p-6 flex-1">
        {loading ? (
          <p className="py-6 text-center text-sm text-fg-subtle">Carregando faturas vencidas...</p>
        ) : error ? (
          <p role="alert" className="py-6 text-center text-sm text-danger-fg">{error}</p>
        ) : data.length === 0 ? (
          <p className="py-6 text-center text-sm text-fg-subtle">Nenhuma fatura vencida encontrada.</p>
        ) : (
          <div className="max-h-[320px] space-y-5 overflow-y-auto pr-2">
            {data.map((invoice, index) => (
              <div
                key={`${invoice.customerName}-${invoice.dueDate}-${index}`}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 bg-danger-soft text-danger-fg border-danger-line">
                    <span className="material-symbols-outlined text-lg">warning</span>
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/dashboard/clientes/codigo/${encodeURIComponent(String(invoice.customerCode))}`}
                      className="block truncate text-sm font-bold text-fg-strong hover:text-accent hover:underline"
                      title={invoice.customerName}
                    >
                      {invoice.customerName || "Cliente sem nome"}
                    </Link>
                    <p className="text-xs text-fg-subtle" title={invoice.description}>
                      {invoice.description}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-bold text-danger-fg">{formatCurrency(invoice.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <a
        href="#todos-clientes"
        className="p-4 text-center border-t border-line text-accent text-sm font-bold hover:bg-canvas transition-all rounded-b-xl"
      >
        Ver todos os riscos
      </a>
    </div>
  );
}

export default DelinquencyRiskPanel;
