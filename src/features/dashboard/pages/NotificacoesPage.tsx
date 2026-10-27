import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationPreferences } from "../hooks/useNotificationPreferences";
import { useNotifications } from "../hooks/useNotifications";
import { ALL_NOTIFICATION_CATEGORIES } from "../types/notificationPreferences";
import { formatDateTime } from "../utils/format";
import type { Notification } from "../types/notification";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function resolveCategoryLabel(category: Notification["category"]): string {
  switch (category) {
    case "INGESTION":
      return "Ingestão";
    case "STATUS_UPDATE":
      return "Atualização";
    case "APPROVAL_NEEDED":
      return "Aprovação";
    case "SYSTEM":
      return "Sistema";
    default:
      return category;
  }
}

function statusBadge(status: Notification["status"]): string {
  switch (status) {
    case "UNREAD":
      return "bg-accent-soft text-accent";
    case "READ":
      return "bg-surface-2 text-fg-muted";
    case "DISMISSED":
      return "bg-danger-soft text-danger-ink";
    default:
      return "bg-surface-2 text-fg-muted";
  }
}

/** Full notifications list backed by the ERP backend's `GET /api/v1/notifications` endpoint. */
function NotificacoesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { enabledCategories } = useNotificationPreferences();
  const { data, loading, error, page, size, setPage, setSize, refetch } = useNotifications(0, 20);
  const allCategoriesEnabled = enabledCategories.length === ALL_NOTIFICATION_CATEGORIES.length;
  const hasAtLeastOneCategoryEnabled = enabledCategories.length > 0;

  const visibleRows = useMemo(() => {
    const rows = (data?.data ?? []).filter((row) => enabledCategories.includes(row.category));
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      [row.name, row.description, row.category, row.priority, row.referenceType ?? "", row.referenceId ?? ""].some(
        (field) => field.toLowerCase().includes(query)
      )
    );
  }, [data, enabledCategories, search]);

  const totalPages = data?.pagination.totalPages ?? 0;
  const currentPage = data?.pagination.page ?? page;
  const totalElements = data?.pagination.total ?? 0;
  const isFirstPage = currentPage <= 0;
  const isLastPage = totalPages === 0 || currentPage >= totalPages - 1;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-fg-strong tracking-tight">Notificações</h2>
          <p className="text-fg-subtle mt-1">Acompanhe alertas e atualizações recentes do sistema.</p>
          {!allCategoriesEnabled && (
            <p className="text-xs text-fg-subtle mt-2">
              Filtro ativo por preferências de categoria em Configurações.
            </p>
          )}
        </div>
      </div>

      <section
        id="todas-notificacoes"
        className="bg-card rounded-xl shadow-card border border-line overflow-hidden"
      >
        <div className="p-6 border-b border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-fg-strong text-lg">Todas as Notificações</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle text-lg">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por título, descrição, categoria ou referência"
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
                    <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
                      Prioridade
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
                      Referência
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
                      Criada em
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {loading &&
                    Array.from({ length: size }).map((_, index) => (
                      <tr key={`skeleton-${index}`} className="animate-pulse">
                        {Array.from({ length: 6 }).map((__, cell) => (
                          <td key={cell} className="px-6 py-4">
                            <div className="h-3.5 bg-surface-2 rounded-full w-full max-w-[14rem]" />
                          </td>
                        ))}
                      </tr>
                    ))}

                  {!loading &&
                    !hasAtLeastOneCategoryEnabled && (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-fg-subtle">
                          Você desabilitou todos os tipos de notificações em Configurações.
                        </td>
                      </tr>
                    )}

                  {!loading &&
                    hasAtLeastOneCategoryEnabled &&
                    visibleRows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => navigate(`/dashboard/notificacoes/${row.id}`)}
                        className="hover:bg-canvas transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-fg-strong">{row.name}</p>
                          <p className="text-xs text-fg-subtle line-clamp-1">{row.description}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-fg-muted whitespace-nowrap">
                          {resolveCategoryLabel(row.category)}
                        </td>
                        <td className="px-6 py-4 text-sm text-fg-muted whitespace-nowrap">{row.priority}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusBadge(row.status)}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-fg-muted whitespace-nowrap">
                          {row.referenceType && row.referenceId
                            ? `${row.referenceType} #${row.referenceId}`
                            : row.referenceType ?? row.referenceId ?? "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-fg-muted whitespace-nowrap">
                          {formatDateTime(row.createdAt)}
                        </td>
                      </tr>
                    ))}

                  {!loading && hasAtLeastOneCategoryEnabled && visibleRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm text-fg-subtle">
                        {search
                          ? `Nenhuma notificação encontrada para "${search}" nesta página.`
                          : "Nenhuma notificação encontrada."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-canvas border-t border-line flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-sm text-fg-subtle">
                {!hasAtLeastOneCategoryEnabled
                  ? "Nenhum tipo de notificação habilitado."
                  : allCategoriesEnabled
                    ? totalElements > 0
                      ? `Exibindo ${data?.data.length ?? 0} de ${totalElements.toLocaleString("pt-BR")} notificações`
                      : "—"
                    : `Exibindo ${visibleRows.length} notificações nesta página conforme suas preferências`}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-fg-muted">
                  Página {totalPages === 0 ? 0 : currentPage + 1} de {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(0, currentPage - 1))}
                    disabled={isFirstPage || loading || !hasAtLeastOneCategoryEnabled}
                    className="p-2 border border-line rounded-lg bg-card text-fg-subtle hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-fg-subtle transition-all"
                    aria-label="Página anterior"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={isLastPage || loading || !hasAtLeastOneCategoryEnabled}
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
    </div>
  );
}

export default NotificacoesPage;
