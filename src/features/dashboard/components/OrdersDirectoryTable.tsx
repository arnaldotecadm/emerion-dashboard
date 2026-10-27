import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerOrders } from "../hooks/useCustomerOrders";
import type { CustomerOrdersPeriod } from "../services/customerOrderService";
import { formatCurrency, formatDate } from "../utils/format";

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const ORDER_STATUS_OPTIONS = [
  "Aguardando Complemento",
  "Aguardando Liberacao do Depto Financeiro",
  "Aguardando Periodo de Programacao",
  "Cancelado",
  "Faturado",
  "Nao Concluido",
  "Parcialmente Faturado",
  "Pronto para Faturar",
];
const PERIOD_OPTIONS: { value: CustomerOrdersPeriod; label: string }[] = [
  { value: "WEEK", label: "Esta semana" },
  { value: "MONTH", label: "Este mês" },
  { value: "YEAR", label: "Este ano" },
  { value: "ALL", label: "Todos" },
];

function getOrderStatusClasses(status: string | null): string {
  const normalizedStatus = status?.trim().toLocaleLowerCase("pt-BR") ?? "";

  if (normalizedStatus.includes("faturad")) return "bg-emerald-100 text-emerald-800";
  if (normalizedStatus.includes("cancel")) return "bg-red-100 text-red-800";
  if (normalizedStatus.includes("penden") || normalizedStatus.includes("aguard")) {
    return "bg-amber-100 text-amber-800";
  }
  if (normalizedStatus.includes("aprov") || normalizedStatus.includes("pronto")) {
    return "bg-blue-100 text-blue-800";
  }

  return "bg-[#006397]/10 text-[#006397]";
}

/** Full order directory table, backed by the ERP backend's `GET /api/v1/customer-orders` endpoint. */
function OrdersDirectoryTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [orderNumberQuery, setOrderNumberQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState<CustomerOrdersPeriod>("ALL");
  const { data, loading, error, page, size, setPage, setSize, refetch } = useCustomerOrders(
    0,
    10,
    undefined,
    statusFilter || undefined,
    undefined,
    orderNumberQuery,
    periodFilter
  );
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setOrderNumberQuery(search.trim()), 300);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const visibleRows = data?.data ?? [];

  const totalPages = data?.pagination.totalPages ?? 0;
  const currentPage = data?.pagination.page ?? page;
  const totalElements = data?.pagination.total ?? 0;
  const isFirstPage = currentPage <= 0;
  const isLastPage = totalPages === 0 || currentPage >= totalPages - 1;

  return (
    <section id="todos-pedidos" className="bg-white rounded-xl shadow-card border border-[#e6e8ea] overflow-hidden">
      <div className="p-6 border-b border-[#e6e8ea] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-[#041627] text-lg">Todos os Pedidos</h3>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <div className="relative w-full sm:w-[26rem] lg:w-[30rem]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8192a7] text-lg">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              placeholder="Buscar por número do pedido (ex.: 719)"
              aria-label="Buscar por número do pedido"
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#e6e8ea] rounded-lg text-[#44474c] focus:outline-none focus:ring-2 focus:ring-[#006397]/30 focus:border-[#006397]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(0);
            }}
            aria-label="Filtrar por status do pedido"
            className="w-full sm:w-auto border border-[#e6e8ea] rounded-lg text-sm text-[#44474c] py-2 px-3 focus:ring-[#006397] focus:border-[#006397]"
          >
            <option value="">Todos os status</option>
            {ORDER_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            value={periodFilter}
            onChange={(event) => {
              const period = PERIOD_OPTIONS.find((option) => option.value === event.target.value)?.value;
              if (period) {
                setPeriodFilter(period);
                setPage(0);
              }
            }}
            aria-label="Filtrar pedidos por período"
            className="w-full sm:w-auto border border-[#e6e8ea] rounded-lg text-sm text-[#44474c] py-2 px-3 focus:ring-[#006397] focus:border-[#006397]"
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
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
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">
                    Num do Pedido
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Cliente</th>
                  {/* <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">NF-e</th> */}
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#8192a7] uppercase tracking-wider">Total</th>
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
                      onClick={() => navigate(`/dashboard/pedidos/${row.id}`)}
                      className="hover:bg-[#f7f9fb] transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 text-sm text-[#8192a7] whitespace-nowrap">{row.numeroPedido}</td>
                      <td className="px-6 py-4 text-sm text-[#44474c]">
                        {row.nomeFantasia?.trim() || row.codigoCliente || "—"}
                      </td>
                      {/*<td className="px-6 py-4 text-sm text-[#44474c] whitespace-nowrap">{row.numeroPedido ?? "—"}</td> */}
                      <td className="px-6 py-4 text-sm text-[#44474c] whitespace-nowrap">{formatDate(row.dataPedido)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getOrderStatusClasses(row.statusPedido)}`}>
                          {row.statusPedido ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#44474c] whitespace-nowrap">
                        {formatCurrency(row.totalPedidoComImpostos)}
                      </td>
                    </tr>
                  ))}

                {!loading && visibleRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#8192a7]">
                      {search
                        ? `Nenhum pedido encontrado para "${search}" nesta página.`
                        : "Nenhum pedido encontrado."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-[#f7f9fb] border-t border-[#e6e8ea] flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-sm text-[#8192a7]">
              {totalElements > 0
                ? `Exibindo ${data?.data.length ?? 0} de ${totalElements.toLocaleString("pt-BR")} pedidos`
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

export default OrdersDirectoryTable;
