import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENTES_DIRECTORY, CLIENTES_DIRECTORY_TOTAL, formatCurrency, type ClienteStatus } from "../data/clientesData";

const STATUS_STYLES: Record<ClienteStatus, string> = {
  Ativo: "bg-emerald-100 text-emerald-700",
  Risco: "bg-[#ffdad6] text-[#93000a]",
  Inativo: "bg-[#eceef0] text-[#8192a7]",
};

const PAGE_SIZE = 8;

/** Full (read-only) client directory table; each row opens the client's detail page. */
function ClientsDirectoryTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return CLIENTES_DIRECTORY;

    return CLIENTES_DIRECTORY.filter((row) =>
      [row.name, row.city, row.status].some((field) => field.toLowerCase().includes(query))
    );
  }, [search]);

  const visibleRows = filteredRows.slice(0, PAGE_SIZE);

  return (
    <section id="todos-clientes" className="bg-white rounded-xl shadow-card border border-[#e6e8ea] overflow-hidden">
      <div className="p-6 border-b border-[#e6e8ea] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-[#041627] text-lg">Todos os Clientes</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8192a7] text-lg">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, cidade ou status"
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#e6e8ea] rounded-lg text-[#44474c] focus:outline-none focus:ring-2 focus:ring-[#006397]/30 focus:border-[#006397]"
            />
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-[#8192a7]">
            <span>Mostrar</span>
            <select className="border border-[#e6e8ea] rounded-lg text-sm text-[#44474c] py-1 px-2 focus:ring-[#006397] focus:border-[#006397]">
              <option>8</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f7f9fb] border-b border-[#e6e8ea]">
              <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Cidade/UF</th>
              <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">
                Limite de Crédito
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Utilizado</th>
              <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">
                Última Compra
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f7f9fb]">
            {visibleRows.map((row) => (
              <tr
                key={row.id}
                onClick={() => navigate(`/dashboard/clientes/${row.id}`)}
                className="hover:bg-[#f7f9fb] transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 font-bold text-[#041627] text-sm group-hover:text-[#006397] transition-colors">
                  {row.name}
                </td>
                <td className="px-6 py-4 text-sm text-[#44474c]">{row.city}</td>
                <td className="px-6 py-4 text-sm text-[#44474c]">{formatCurrency(row.creditLimit)}</td>
                <td
                  className={`px-6 py-4 text-sm font-medium ${
                    row.utilizedPct >= 90 ? "text-[#ba1a1a]" : "text-[#041627]"
                  }`}
                >
                  {row.utilizedPct}%
                </td>
                <td className="px-6 py-4 text-sm text-[#44474c]">{row.lastPurchase}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${STATUS_STYLES[row.status]}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="material-symbols-outlined text-base text-[#c4c6cd] group-hover:text-[#006397] transition-colors">
                    chevron_right
                  </span>
                </td>
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-[#8192a7]">
                  Nenhum cliente encontrado para "{search}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-[#f7f9fb] border-t border-[#e6e8ea] flex justify-between items-center">
        <span className="text-sm text-[#8192a7]">
          {search.trim() ? (
            <>
              Exibindo {visibleRows.length} de {filteredRows.length} resultado
              {filteredRows.length === 1 ? "" : "s"}
            </>
          ) : (
            <>
              Exibindo 1-{Math.min(PAGE_SIZE, CLIENTES_DIRECTORY.length)} de{" "}
              {CLIENTES_DIRECTORY_TOTAL.toLocaleString("pt-BR")} clientes
            </>
          )}
        </span>
        <div className="flex gap-2">
          <button className="p-2 border border-[#e6e8ea] rounded-lg bg-white text-[#8192a7] hover:text-[#006397] transition-all">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="px-3 py-2 border border-[#006397] rounded-lg bg-[#006397] text-white text-sm font-bold">
            1
          </button>
          <button className="px-3 py-2 border border-[#e6e8ea] rounded-lg bg-white text-[#44474c] hover:border-[#006397] hover:text-[#006397] text-sm font-bold transition-all">
            2
          </button>
          <button className="px-3 py-2 border border-[#e6e8ea] rounded-lg bg-white text-[#44474c] hover:border-[#006397] hover:text-[#006397] text-sm font-bold transition-all">
            3
          </button>
          <button className="p-2 border border-[#e6e8ea] rounded-lg bg-white text-[#44474c] hover:text-[#006397] transition-all">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ClientsDirectoryTable;
