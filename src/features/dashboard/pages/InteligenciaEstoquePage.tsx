import { useEffect, useState } from "react";
import { useSmartStock } from "../hooks/useSmartStock";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function InteligenciaEstoquePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { data, error, loading, page, size, hasNextPage, setPage, setSize } = useSmartStock();

  useEffect(() => {
    if (!toastMessage) return;

    const timeoutId = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#041627]">Inteligência de Estoque & Reposição</h2>
        <p className="mt-1 text-[#8192a7]">
          Estoque mínimo, custo ponderado e sugestões de reposição para os produtos.
        </p>
      </div>

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-emerald-500 bg-[#041627] px-4 py-3 text-white shadow-xl"
        >
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Patrimônio em Estoque"
          value="R$ 492.350,00"
          detail="Custo Ponderado Total"
          icon="inventory_2"
          iconClass="bg-purple-50 text-purple-600"
        />
        <MetricCard
          title="Risco de Ruptura (Mínimo)"
          value="3 Itens Críticos"
          detail="Estoque < Estoque Mínimo"
          icon="warning"
          iconClass="bg-rose-50 text-rose-600"
          valueClass="text-rose-600"
        />
        <MetricCard
          title="Estoque Comprometido"
          value="34.2% Reservado"
          detail="Vinculado a pedidos em aberto"
          icon="inventory"
          iconClass="bg-blue-50 text-blue-600"
          valueClass="text-blue-600"
        />
        <MetricCard
          title="Lead Time Médio Fornecedor"
          value="17.4 Dias"
          detail="Importação & Nacional"
          icon="schedule"
          iconClass="bg-emerald-50 text-emerald-600"
          valueClass="text-emerald-600"
        />
      </div>

      <section className="rounded-2xl border border-[#e6e8ea] bg-white p-5 shadow-card sm:p-6">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-[#041627]">
              <span className="material-symbols-outlined text-lg text-purple-600">shopping_cart</span>
              Central de Reposição Inteligente & Custos (Delphi Itens)
            </h3>
            <p className="mt-1 text-xs text-[#8192a7]">
              Cruzamento de estoque mínimo, custo ponderado vs. última compra e sugestão de reposição
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#44474c]">
            <label htmlFor="smart-stock-page-size">Linhas por página</label>
            <select
              id="smart-stock-page-size"
              value={size}
              onChange={(event) => setSize(Number(event.target.value) as 10 | 25 | 50)}
              className="rounded-lg border border-[#c4c6cd] bg-white px-2.5 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006397]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="mb-2 flex justify-end text-xs text-[#8192a7]">
          <span className="group relative inline-flex">
            <button
              type="button"
              aria-label="Informação sobre lead time"
              aria-describedby="lead-time-help"
              title="A informação de lead time está em desenvolvimento."
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-[#f7f9fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006397]"
            >
              <span className="material-symbols-outlined text-sm">schedule</span>
              Sobre o Lead Time
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#8192a7] text-[10px] font-bold">
                ?
              </span>
            </button>
            <span
              id="lead-time-help"
              role="tooltip"
              className="invisible absolute bottom-full right-0 z-30 mb-2 w-64 rounded-lg bg-[#041627] px-3 py-2 text-left text-[11px] leading-relaxed text-white opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
            >
              A informação de lead time está em desenvolvimento.
            </span>
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[#e6e8ea]">
          <table className="w-full min-w-[1050px] text-left text-xs">
            <thead className="border-b border-[#e6e8ea] bg-[#f7f9fb] text-[#44474c]">
              <tr>
                <th className="px-3 py-3 font-semibold">Código / Descrição</th>
                <th className="px-3 py-3 font-semibold">Origem</th>
                <th className="px-3 py-3 text-center font-semibold">Nível Estoque (Mín x Atual)</th>
                <th className="px-3 py-3 text-right font-semibold">Custo Ponderado</th>
                <th className="px-3 py-3 text-right font-semibold">Última Compra</th>
                <th className="px-3 py-3 text-right font-semibold">Markup</th>
                <th className="px-3 py-3 text-center font-semibold">Lead Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef0]">
              {data?.data.map((item) => {
                const stockHealthRatio =
                  item.estoqueMinimo > 0
                    ? Math.max(0, Math.min(100, (item.estoqueAtual / item.estoqueMinimo) * 100))
                    : null;
                const costIncreased = item.custoUltimaCompra > item.custoPonderado;

                return (
                  <tr key={item.codigo} className="hover:bg-[#f7f9fb]">
                    <td className="px-3 py-3 font-medium text-[#191c1e]">
                      <div className="font-mono font-bold text-[#006397]">{item.codigo}</div>
                      <div className="font-semibold">{item.descricao}</div>
                    </td>
                    <td className="max-w-64 px-3 py-3 text-[#44474c]" title={item.origem}>
                      {item.origem}
                    </td>
                    <td className="min-w-44 px-3 py-3">
                      <div className="mb-1 flex justify-between text-[10px] font-medium">
                        <span className="text-[#8192a7]">Mín: {item.estoqueMinimo}</span>
                        <span
                          className={`font-bold ${
                            item.estoqueAtual < item.estoqueMinimo ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          Atual: {item.estoqueAtual}
                        </span>
                      </div>
                      {stockHealthRatio !== null && (
                        <div
                          className="h-2 w-full overflow-hidden rounded-full bg-[#eceef0]"
                          aria-label={`Estoque atual em ${Math.round(stockHealthRatio)}% do mínimo`}
                        >
                          <div
                            className={`h-full rounded-full ${
                              stockHealthRatio < 50
                                ? "bg-rose-500"
                                : stockHealthRatio < 100
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.max(10, stockHealthRatio)}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-medium">
                      {currencyFormatter.format(item.custoPonderado)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="font-mono font-medium">{currencyFormatter.format(item.custoUltimaCompra)}</div>
                      <span
                        className={`mt-1 flex items-center justify-end gap-0.5 text-[10px] font-semibold ${
                          costIncreased ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {costIncreased ? "trending_up" : "trending_down"}
                        </span>
                        {costIncreased ? "Custo Subiu" : "Estável"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-[#44474c]">
                      {item.markup.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-[#44474c]">
                      {item.leadTime.toLocaleString("pt-BR")} dias
                    </td>
                  </tr>
                );
              })}
              {loading && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-[#8192a7]">
                    Carregando itens de estoque...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-[#ba1a1a]">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && data?.data.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-[#8192a7]">
                    Nenhum item encontrado nesta página.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-[#8192a7]">
            Página {page + 1} · {data?.data.length ?? 0} itens (máximo de {size} por página)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading || page === 0}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border border-[#c4c6cd] px-3 py-2 text-xs font-semibold text-[#44474c] hover:bg-[#f7f9fb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={loading || !hasNextPage}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-[#c4c6cd] px-3 py-2 text-xs font-semibold text-[#44474c] hover:bg-[#f7f9fb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  detail,
  icon,
  iconClass,
  valueClass = "text-[#041627]",
}: {
  title: string;
  value: string;
  detail: string;
  icon: string;
  iconClass: string;
  valueClass?: string;
}) {
  return (
    <article className="rounded-2xl border border-[#e6e8ea] bg-white p-6 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[#8192a7]">{title}</span>
        <span className={`material-symbols-outlined rounded-lg p-2 text-lg ${iconClass}`}>{icon}</span>
      </div>
      <div className={`mt-3 text-2xl font-bold ${valueClass}`}>{value}</div>
      <div className="mt-1 text-xs text-[#8192a7]">{detail}</div>
    </article>
  );
}

export default InteligenciaEstoquePage;
