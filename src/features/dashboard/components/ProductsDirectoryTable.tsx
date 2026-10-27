import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { formatCurrency, formatDate } from "../utils/format";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

/** Full product directory table, backed by the ERP backend's `GET /api/v1/products` endpoint. */
function ProductsDirectoryTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data, loading, error, page, size, setPage, setSize, refetch } = useProducts(0, 10);

  const visibleRows = useMemo(() => {
    const rows = data?.data ?? [];
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) => [row.nome, row.externalId].some((field) => field.toLowerCase().includes(query)));
  }, [data, search]);

  const totalPages = data?.pagination.totalPages ?? 0;
  const currentPage = data?.pagination.page ?? page;
  const totalElements = data?.pagination.total ?? 0;
  const isFirstPage = currentPage <= 0;
  const isLastPage = totalPages === 0 || currentPage >= totalPages - 1;

  return (
    <section id="todos-produtos" className="bg-card rounded-xl shadow-card border border-line overflow-hidden">
      <div className="p-6 border-b border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-fg-strong text-lg">Todos os Produtos</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle text-lg">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar nesta página por nome ou Codigo"
              className="w-full pl-9 pr-3 py-2 text-sm border border-line rounded-lg text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-fg-subtle">
            <span>Mostrar</span>
            <select
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              className="border border-line rounded-lg text-sm text-fg-muted py-1 px-2 focus:ring-accent focus:border-accent"
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="p-10 flex flex-col items-center text-center gap-3">
          <span className="material-symbols-outlined text-4xl text-danger-fg">error</span>
          <p className="text-sm text-fg-muted">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 text-sm font-semibold text-accent border border-accent rounded-lg hover:bg-accent-solid/5 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-canvas border-b border-line">
                  <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
                    Codigo
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
                    Cadastrado em
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {loading &&
                  Array.from({ length: size }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="animate-pulse">
                      {Array.from({ length: 4 }).map((__, cell) => (
                        <td key={cell} className="px-6 py-4">
                          <div className="h-3.5 bg-surface-2 rounded-full w-full max-w-[10rem]" />
                        </td>
                      ))}
                    </tr>
                  ))}

                {!loading &&
                  visibleRows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => navigate(`/dashboard/produtos/${row.id}`)}
                      className="hover:bg-canvas transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 text-sm text-fg-subtle whitespace-nowrap">{row.externalId}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-fg-strong">{row.nome}</td>
                      <td className="px-6 py-4 text-sm text-fg-muted whitespace-nowrap">
                        {formatCurrency(row.preco)}
                      </td>
                      <td className="px-6 py-4 text-sm text-fg-muted whitespace-nowrap">
                        {formatDate(row.createdAt)}
                      </td>
                    </tr>
                  ))}

                {!loading && visibleRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-fg-subtle">
                      {search
                        ? `Nenhum produto encontrado para "${search}" nesta página.`
                        : "Nenhum produto encontrado."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-canvas border-t border-line flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-sm text-fg-subtle">
              {totalElements > 0
                ? `Exibindo ${data?.data.length ?? 0} de ${totalElements.toLocaleString("pt-BR")} produtos`
                : "—"}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-fg-muted">
                Página {totalPages === 0 ? 0 : currentPage + 1} de {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(0, currentPage - 1))}
                  disabled={isFirstPage || loading}
                  className="p-2 border border-line rounded-lg bg-card text-fg-subtle hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-fg-subtle transition-all"
                  aria-label="Página anterior"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={isLastPage || loading}
                  className="p-2 border border-line rounded-lg bg-card text-fg-subtle hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-fg-subtle transition-all"
                  aria-label="Próxima página"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default ProductsDirectoryTable;
