interface MixSlice {
  label: string;
  pct: number;
  color: string;
  /** stroke-dasharray offset (cumulative % of prior slices) around the 100-unit circle. */
  offset: number;
}

const SLICES: MixSlice[] = [
  { label: "Software", pct: 45, color: "#006397", offset: 0 },
  { label: "Serviços", pct: 25, color: "#18a659", offset: 45 },
  { label: "Hardware", pct: 20, color: "#e28e00", offset: 70 },
  { label: "Outros", pct: 10, color: "#ba1a1a", offset: 90 },
];

/** Donut chart card breaking down revenue share by product category. */
function ProductMixPanel() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-card">
      <h3 className="font-bold text-[#041627] mb-4">Mix de Produtos</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="transparent" stroke="#e6e8ea" strokeWidth="4" />
            {SLICES.map((slice) => (
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
        </div>
        <div className="space-y-2">
          {SLICES.map((slice) => (
            <div key={slice.label} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="text-[11px] font-medium text-[#44474c]">
                {slice.label} ({slice.pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductMixPanel;
