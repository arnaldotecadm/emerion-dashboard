import UnavailableDataNotice from "./UnavailableDataNotice";

/** Placeholder for sales-channel analytics until channel tracking is enabled. */
function SalesChannelPanel() {
  return (
    <div className="bg-card rounded-xl shadow-card border border-line p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-fg-strong">Vendas por Canal</h3>
        <span className="material-symbols-outlined text-fg-subtle">alt_route</span>
      </div>
      <div className="min-w-0">
        <UnavailableDataNotice
          icon="alt_route"
          description="Os dados de canais de venda poderão ser exibidos quando a empresa optar por acompanhar essa informação."
        />
      </div>
    </div>
  );
}

export default SalesChannelPanel;
