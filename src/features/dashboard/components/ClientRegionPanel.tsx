import { CLIENT_REGIONS, CLIENTES_DIRECTORY_TOTAL } from "../data/clientesData";

/** Donut chart card breaking down the client base by Brazilian macro-region (no segment taxonomy exists). */
function ClientRegionPanel() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-card border border-[#e6e8ea] h-full">
      <h3 className="font-bold text-[#041627] text-lg mb-4">Distribuição por Região</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="transparent" stroke="#e6e8ea" strokeWidth="4" />
            {CLIENT_REGIONS.map((slice) => (
              <circle
                key={slice.label}
                cx="18"
                cy="18"
                r="16"
                fill="transparent"
                stroke={slice.color}
                strokeWidth="4"
                strokeDasharray={`${slice.pct} ${100 - slice.pct}`}
                strokeDashoffset={-slice.offset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-[#041627]">{CLIENTES_DIRECTORY_TOTAL.toLocaleString("pt-BR")}</p>
            <p className="text-[9px] text-[#8192a7] font-bold uppercase">Total</p>
          </div>
        </div>
        <div className="space-y-2">
          {CLIENT_REGIONS.map((slice) => (
            <div key={slice.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="text-xs text-[#44474c]">
                {slice.label} ({slice.pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClientRegionPanel;
