export interface PlaceholderPageProps {
  icon: string;
  title: string;
  description: string;
}

/**
 * Generic empty-state page used for sections that don't have content yet
 * (e.g. side-menu items pending implementation).
 */
function PlaceholderPage({ icon, title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-card rounded-xl shadow-card border border-dashed border-line-strong py-24 px-8">
      <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center text-accent mb-6">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h2 className="text-xl font-semibold text-fg-strong mb-2">{title}</h2>
      <p className="text-sm text-fg-muted max-w-md mb-6">{description}</p>
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent bg-accent-soft px-3 py-1 rounded-full">
        <span className="material-symbols-outlined text-xs">construction</span>
        Em breve
      </span>
    </div>
  );
}

export default PlaceholderPage;
