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
    <div className="flex flex-col items-center justify-center text-center bg-white rounded-xl shadow-[0px_4px_12px_rgba(26,43,60,0.05)] border border-dashed border-[#c4c6cd] py-24 px-8">
      <div className="w-16 h-16 rounded-full bg-[#eceef0] flex items-center justify-center text-[#006397] mb-6">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h2 className="text-xl font-semibold text-[#041627] mb-2">{title}</h2>
      <p className="text-sm text-[#44474c] max-w-md mb-6">{description}</p>
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#006397] bg-[#cce5ff] px-3 py-1 rounded-full">
        <span className="material-symbols-outlined text-xs">construction</span>
        Em breve
      </span>
    </div>
  );
}

export default PlaceholderPage;
