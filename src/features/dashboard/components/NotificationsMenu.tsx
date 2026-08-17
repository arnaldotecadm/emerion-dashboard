import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tooltip from "../../../components/Tooltip";
import { useNotificationPreferences } from "../hooks/useNotificationPreferences";
import { useNotifications } from "../hooks/useNotifications";
import { dismissNotification } from "../services/notificationService";
import { formatDateTime } from "../utils/format";
import type { Notification } from "../types/notification";

function iconByCategory(category: Notification["category"]): string {
  switch (category) {
    case "INGESTION":
      return "sync";
    case "STATUS_UPDATE":
      return "update";
    case "APPROVAL_NEEDED":
      return "rule";
    case "SYSTEM":
      return "settings";
    default:
      return "notifications";
  }
}

/** Top-right dropdown showing the latest system notifications. */
function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [dismissingId, setDismissingId] = useState<number | null>(null);
  const [dismissError, setDismissError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { enabledCategories } = useNotificationPreferences();
  const notificationsQuery = useNotifications(0, 10);
  const unreadIngestionQuery = useNotifications(0, 1, "UNREAD", "INGESTION");
  const unreadStatusUpdateQuery = useNotifications(0, 1, "UNREAD", "STATUS_UPDATE");
  const unreadApprovalNeededQuery = useNotifications(0, 1, "UNREAD", "APPROVAL_NEEDED");
  const unreadSystemQuery = useNotifications(0, 1, "UNREAD", "SYSTEM");
  const refetchNotifications = notificationsQuery.refetch;
  const refetchUnread = useCallback(() => {
    unreadIngestionQuery.refetch();
    unreadStatusUpdateQuery.refetch();
    unreadApprovalNeededQuery.refetch();
    unreadSystemQuery.refetch();
  }, [
    unreadApprovalNeededQuery,
    unreadIngestionQuery,
    unreadStatusUpdateQuery,
    unreadSystemQuery,
  ]);

  const notifications = (notificationsQuery.data?.data ?? []).filter((item) => enabledCategories.includes(item.category));
  const unreadByCategory: Record<Notification["category"], number> = {
    INGESTION: unreadIngestionQuery.data?.pagination.total ?? 0,
    STATUS_UPDATE: unreadStatusUpdateQuery.data?.pagination.total ?? 0,
    APPROVAL_NEEDED: unreadApprovalNeededQuery.data?.pagination.total ?? 0,
    SYSTEM: unreadSystemQuery.data?.pagination.total ?? 0,
  };
  const unreadCount = enabledCategories.reduce((total, category) => total + unreadByCategory[category], 0);
  const hasAtLeastOneCategoryEnabled = enabledCategories.length > 0;

  const goToNotification = (id: number) => {
    setOpen(false);
    navigate(`/dashboard/notificacoes/${id}`);
  };

  const goToNotificationsList = () => {
    setOpen(false);
    navigate("/dashboard/notificacoes");
  };

  const goToSettings = () => {
    setOpen(false);
    navigate("/dashboard/configuracoes");
  };

  const handleDismiss = (id: number) => {
    if (dismissingId === id) return;
    setDismissError(null);
    setDismissingId(id);
    dismissNotification(id)
      .then(() => {
        refetchNotifications();
        refetchUnread();
      })
      .catch((err: unknown) => {
        setDismissError(err instanceof Error ? err.message : "Não foi possível dispensar a notificação.");
      })
      .finally(() => {
        setDismissingId(null);
      });
  };

  useEffect(() => {
    if (!open) return;

    refetchNotifications();
    refetchUnread();

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, refetchNotifications, refetchUnread]);

  useEffect(() => {
    refetchUnread();
    // This keeps the badge in sync when the user changes settings in Configurações.
  }, [enabledCategories, refetchUnread]);

  return (
    <div className="relative" ref={containerRef}>
      <Tooltip label="Notificações">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="relative p-2 text-[#44474c] hover:bg-[#eceef0] rounded-full transition-colors"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Notificações"
        >
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-[#ba1a1a] text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </Tooltip>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-popover border border-[#e6e8ea] overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-[#eceef0] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#041627]">Notificações</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#006397] bg-[#cce5ff] px-2 py-0.5 rounded-full">
                {unreadCount} novas
              </span>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-[#eceef0]">
            {dismissError && <div className="px-4 py-2 text-xs text-[#ba1a1a]">{dismissError}</div>}
            {!hasAtLeastOneCategoryEnabled && (
              <div className="p-4 text-center text-xs text-[#8192a7] space-y-2">
                <p>Você desabilitou todos os tipos de notificações.</p>
                <button onClick={goToSettings} className="text-xs font-semibold text-[#006397] hover:underline">
                  Ajustar preferências
                </button>
              </div>
            )}
            {notificationsQuery.loading &&
              hasAtLeastOneCategoryEnabled &&
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="px-4 py-3 flex gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-[#eceef0] shrink-0" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3.5 w-40 bg-[#eceef0] rounded-full" />
                    <div className="h-3 w-full bg-[#eceef0] rounded-full" />
                    <div className="h-2.5 w-24 bg-[#eceef0] rounded-full" />
                  </div>
                </div>
              ))}

            {!notificationsQuery.loading && notificationsQuery.error && (
              <div className="p-4 text-center">
                <p className="text-xs text-[#ba1a1a] mb-2">{notificationsQuery.error}</p>
                <button
                  onClick={notificationsQuery.refetch}
                  className="text-xs font-semibold text-[#006397] hover:underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!notificationsQuery.loading && !notificationsQuery.error && notifications.length === 0 && (
              <div className="p-4 text-center text-xs text-[#8192a7]">Nenhuma notificação encontrada.</div>
            )}

            {!notificationsQuery.loading &&
              !notificationsQuery.error &&
              notifications.map((item) => {
                const unread = item.status === "UNREAD";
                return (
                  <div key={item.id} className="flex items-start">
                    <button
                      type="button"
                      onClick={() => goToNotification(item.id)}
                      className="flex-1 flex gap-3 px-4 py-3 text-left hover:bg-[#f7f9fb] transition-colors"
                    >
                      <span
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          unread ? "bg-[#cce5ff] text-[#006397]" : "bg-[#eceef0] text-[#44474c]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">{iconByCategory(item.category)}</span>
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#191c1e] truncate">{item.name}</p>
                        <p className="text-xs text-[#44474c] line-clamp-2">{item.description}</p>
                        <p className="text-[10px] text-[#8192a7] mt-1">{formatDateTime(item.createdAt)}</p>
                      </div>
                      {unread && <span className="w-2 h-2 rounded-full bg-[#006397] shrink-0 mt-1.5" aria-hidden />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDismiss(item.id)}
                      disabled={item.status === "DISMISSED" || dismissingId === item.id}
                      className="mx-2 mt-3 p-1.5 rounded-md text-[#8192a7] hover:text-[#93000a] hover:bg-[#ffdad6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label={item.status === "DISMISSED" ? "Notificação dispensada" : "Dispensar notificação"}
                      title={item.status === "DISMISSED" ? "Notificação dispensada" : "Dispensar notificação"}
                    >
                      <span className="material-symbols-outlined text-base">
                        {dismissingId === item.id ? "hourglass_top" : "close"}
                      </span>
                    </button>
                  </div>
                );
              })}
          </div>
          <div className="px-4 py-2.5 border-t border-[#eceef0] text-center">
            <button
              onClick={goToNotificationsList}
              disabled={!hasAtLeastOneCategoryEnabled}
              className="text-xs font-semibold text-[#006397] hover:underline disabled:text-[#8192a7] disabled:no-underline"
            >
              Ver todas as notificações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsMenu;
