import UnavailableDataNotice from "./UnavailableDataNotice";

/** Placeholder for client-level credit utilization until credit limits are actively tracked. */
function CreditUtilizationPanel() {
  return (
    <div className="bg-card p-6 rounded-xl shadow-card border border-line h-full">
      <h3 className="font-bold text-fg-strong text-lg mb-4">Limite de Crédito por Cliente</h3>
      <UnavailableDataNotice
        icon="credit_score"
        description="Os limites e a utilização por cliente poderão ser exibidos quando esse controle estiver em uso."
      />
    </div>
  );
}

export default CreditUtilizationPanel;
