import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendedores } from "../hooks/useVendedores";
import { formatCurrency } from "../utils/format";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

/** Full vendedor (salesman) directory table, backed by the ERP backend's `GET /api/v1/vendedores` endpoint. */
function VendedoresDirectoryTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data, loading, error, page, size, setPage, setSize, refetch } = useVendedores(0, 10);

  const visibleRows = useMemo(() => {
    const rows = data?.data ?? [];
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      [row.nome, row.apelido ?? "", row.cidade ?? "", row.uf ?? ""].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [data, search]);

  const totalPages = data?.pagination.totalPages ?? 0;
  const currentPage = data?.pagination.page ?? page;
  const totalElements = data?.pagination.total ?? 0;
  const isFirstPage = currentPage <= 0;
  const isLastPage = totalPages === 0 || currentPage >= totalPages - 1;

  return (
    <section id="todos-vendedores" className="bg-white rounded-xl shadow-card border border-[#e6e8ea] overflow-hidden">
      <div className="p-6 border-b border-[#e6e8ea] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-[#041627] text-lg">Todos os Vendedores</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8192a7] text-lg">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar nesta página por nome, apelido ou cidade"
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#e6e8ea] rounded-lg text-[#44474c] focus:outline-none focus:ring-2 focus:ring-[#006397]/30 focus:border-[#006397]"
            />
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-[#8192a7]">
            <span>Mostrar</span>
            <select
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              className="border border-[#e6e8ea] rounded-lg text-sm text-[#44474c] py-1 px-2 focus:ring-[#006397] focus:border-[#006397]"
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
          <span className="material-symbols-outlined text-4xl text-[#ba1a1a]">error</span>
          <p className="text-sm text-[#44474c]">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 text-sm font-semibold text-[#006397] border border-[#006397] rounded-lg hover:bg-[#006397]/5 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f7f9fb] border-b border-[#e6e8ea]">
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Contato</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Cidade/UF</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Saldo</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f7f9fb]">
                {loading &&
                  Array.from({ length: size }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="animate-pulse">
                      {Array.from({ length: 6 }).map((__, cell) => (
                        <td key={cell} className="px-6 py-4">
                          <div className="h-3.5 bg-[#eceef0] rounded-full w-full max-w-[10rem]" />
                        </td>
                      ))}
                    </tr>
                  ))}

                {!loading &&
                  visibleRows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => navigate(`/dashboard/vendedores/${row.id}`)}
                      className="hover:bg-[#f7f9fb] transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 text-sm text-[#8192a7]">{row.id}</td>
                      <td className="px-6 py-4 text-sm text-[#44474c]">
                        {row.nome}
                        {row.apelido && <span className="text-[#8192a7]"> ({row.apelido})</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#44474c] whitespace-nowrap">
                        {row.email ?? row.celular ?? row.telefone ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#44474c] whitespace-nowrap">
                        {row.cidade ? `${row.cidade}${row.uf ? `/${row.uf}` : ""}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#44474c] whitespace-nowrap">
                        {formatCurrency(row.saldo)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            row.situacao?.toLowerCase() === "ativo"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-[#eceef0] text-[#44474c]"
                          }`}
                        >
                          {row.situacao ?? "—"}
                        </span>
                      </td>
                    </tr>
                  ))}

                {!loading && visibleRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#8192a7]">
                      {search
                        ? `Nenhum vendedor encontrado para "${search}" nesta página.`
                        : "Nenhum vendedor encontrado."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-[#f7f9fb] border-t border-[#e6e8ea] flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-sm text-[#8192a7]">
              {totalElements > 0
                ? `Exibindo ${data?.data.length ?? 0} de ${totalElements.toLocaleString("pt-BR")} vendedores`
                : "—"}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#44474c]">
                Página {totalPages === 0 ? 0 : currentPage + 1} de {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(0, currentPage - 1))}
                  disabled={isFirstPage || loading}
                  className="p-2 border border-[#e6e8ea] rounded-lg bg-white text-[#8192a7] hover:text-[#006397] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[#8192a7] transition-all"
                  aria-label="Página anterior"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={isLastPage || loading}
                  className="p-2 border border-[#e6e8ea] rounded-lg bg-white text-[#8192a7] hover:text-[#006397] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[#8192a7] transition-all"
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

export default VendedoresDirectoryTable;
