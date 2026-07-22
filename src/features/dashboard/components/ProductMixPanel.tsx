import { useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { formatCurrency } from "../utils/format";

const SLICE_COLORS = ["#006397", "#18a659", "#e28e00", "#ba1a1a"];
const MAX_SLICES = 4;

/** Donut chart card breaking down price share among the ERP's most recently registered products. */
function ProductMixPanel() {
  const { data, loading, error } = useProducts(0, MAX_SLICES);

  const slices = useMemo(() => {
    const products = data?.data ?? [];
    const total = products.reduce((sum, product) => sum + (product.preco ?? 0), 0);
    if (total <= 0) return [];

    let offset = 0;
    return products.map((product, index) => {
      const pct = ((product.preco ?? 0) / total) * 100;
      const slice = {
        label: product.nome,
        preco: product.preco,
        pct,
        color: SLICE_COLORS[index % SLICE_COLORS.length],
        offset,
      };
      offset += pct;
      return slice;
    });
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-card">
      <h3 className="font-bold text-[#041627] mb-4">Mix de Produtos</h3>

      {error && <p className="text-sm text-[#8192a7]">Não foi possível carregar os produtos.</p>}

      {!error && loading && (
        <div className="flex items-center gap-6 animate-pulse">
          <div className="w-24 h-24 rounded-full bg-[#eceef0] shrink-0" />
          <div className="space-y-2 flex-1">
            {Array.from({ length: MAX_SLICES }).map((_, index) => (
              <div key={index} className="h-3 bg-[#eceef0] rounded-full w-full max-w-[8rem]" />
            ))}
          </div>
        </div>
      )}

      {!error && !loading && slices.length === 0 && (
        <p className="text-sm text-[#8192a7]">Nenhum produto cadastrado.</p>
      )}

      {!error && !loading && slices.length > 0 && (
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="transparent" stroke="#e6e8ea" strokeWidth="4" />
              {slices.map((slice) => (
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
            {slices.map((slice) => (
              <div key={slice.label} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="text-[11px] font-medium text-[#44474c]">
                  {slice.label} ({formatCurrency(slice.preco)})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductMixPanel;
