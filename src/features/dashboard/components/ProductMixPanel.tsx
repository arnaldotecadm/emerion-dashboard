import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
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

    return products.map((product, index) => {
      const pct = ((product.preco ?? 0) / total) * 100;
      return {
        id: product.id,
        label: product.nome,
        preco: product.preco,
        pct,
        color: SLICE_COLORS[index % SLICE_COLORS.length],
      };
    });
  }, [data]);

  return (
    <div className="bg-card p-6 rounded-xl shadow-card">
      <h3 className="font-bold text-fg-strong mb-4">Mix de Produtos</h3>

      {error && <p className="text-sm text-fg-subtle">Não foi possível carregar os produtos.</p>}

      {!error && loading && (
        <div className="flex items-center gap-6 animate-pulse">
          <div className="w-24 h-24 rounded-full bg-surface-2 shrink-0" />
          <div className="space-y-2 flex-1">
            {Array.from({ length: MAX_SLICES }).map((_, index) => (
              <div key={index} className="h-3 bg-surface-2 rounded-full w-full max-w-[8rem]" />
            ))}
          </div>
        </div>
      )}

      {!error && !loading && slices.length === 0 && (
        <p className="text-sm text-fg-subtle">Nenhum produto cadastrado.</p>
      )}

      {!error && !loading && slices.length > 0 && (
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart accessibilityLayer>
                <Pie
                  data={slices}
                  dataKey="pct"
                  nameKey="label"
                  innerRadius="76%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  isAnimationActive
                >
                  {slices.map((slice) => <Cell key={slice.label} fill={slice.color} />)}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    const slice = payload?.[0]?.payload as (typeof slices)[number] | undefined;
                    if (!active || !slice) return null;
                    return (
                      <div className="rounded-lg bg-ink-solid px-3 py-2 text-white shadow-lg">
                        <p className="text-xs font-bold">{slice.label}</p>
                        <p className="text-[11px]">{slice.pct.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%</p>
                        <p className="text-[11px]">{formatCurrency(slice.preco)}</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {slices.map((slice) => (
              <Link
                key={slice.label}
                to={`/dashboard/produtos/${slice.id}`}
                className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="text-[11px] font-medium text-fg-muted group-hover:text-accent group-hover:underline">
                  {slice.label} ({formatCurrency(slice.preco)})
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductMixPanel;
