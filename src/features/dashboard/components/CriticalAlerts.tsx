import { formatNumber } from "../utils/format";

interface AlertItem {
  icon: string;
  title: string;
  count: number;
  description: string;
  ctaLabel: string;
  severity: "error" | "warning";
}

const ALERTS: AlertItem[] = [
  {
    icon: "credit_card_off",
    title: "Clientes com Limite Excedido",
    count: 8,
    description: "clientes ativos acima do teto permitido.",
    ctaLabel: "REVISAR AGORA →",
    severity: "error",
  },
  {
    icon: "block",
    title: "Pedidos Bloqueados",
    count: 15,
    description: "ordens retidas por análise de crédito.",
    ctaLabel: "REVISAR AGORA →",
    severity: "error",
  },
  {
    icon: "inventory_2",
    title: "Baixo Estoque (Curva A)",
    count: 5,
    description: "itens essenciais abaixo do estoque de segurança.",
    ctaLabel: "ABRIR COMPRAS →",
    severity: "warning",
  },
];

/** Bottom section listing critical system alerts requiring action. */
function CriticalAlerts() {
  return (
    <section className="bg-surface-3 p-6 rounded-xl border border-line-strong">
      <div className="flex items-center gap-2 mb-4 text-danger-fg">
        <span className="material-symbols-outlined">report</span>
        <h3 className="text-xl font-semibold">Alertas Críticos do Sistema</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ALERTS.map((alert) => (
          <div
            key={alert.title}
            className={`bg-card p-4 rounded-lg flex gap-4 border ${
              alert.severity === "error" ? "border-danger-fg/20" : "border-line"
            }`}
          >
            <div
              className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${
                alert.severity === "error" ? "bg-danger-soft text-danger-fg" : "bg-surface-2 text-fg-muted"
              }`}
            >
              <span className="material-symbols-outlined">{alert.icon}</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-fg-strong">{alert.title}</h4>
              <p className="text-xs text-fg-muted">
                {formatNumber(alert.count)} {alert.description}
              </p>
              <a className="text-accent text-[10px] font-bold mt-2 inline-block" href="#">
                {alert.ctaLabel}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CriticalAlerts;
