import { useEffect, useRef, useState } from "react";
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
  const {
    data: notificationsData,
    loading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useNotifications(0, 100);
  const refetchUnread = refetchNotifications;

  const notifications = (notificationsData?.data ?? []).filter((item) => enabledCategories.includes(item.category));
  const unreadByCategory: Record<Notification["category"], number> = {
    INGESTION:
      notificationsData?.data.filter((item) => item.status === "UNREAD" && item.category === "INGESTION").length ?? 0,
    STATUS_UPDATE:
      notificationsData?.data.filter((item) => item.status === "UNREAD" && item.category === "STATUS_UPDATE").length ?? 0,
    APPROVAL_NEEDED:
      notificationsData?.data.filter((item) => item.status === "UNREAD" && item.category === "APPROVAL_NEEDED").length ?? 0,
    SYSTEM:
      notificationsData?.data.filter((item) => item.status === "UNREAD" && item.category === "SYSTEM").length ?? 0,
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

  return (
    <div className="relative" ref={containerRef}>
      <Tooltip label="Notificações">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="relative p-2 text-fg-muted hover:bg-surface-2 rounded-full transition-colors"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Notificações"
        >
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-danger-solid text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </Tooltip>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-80 bg-card rounded-xl shadow-popover border border-line overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-line-soft flex items-center justify-between">
            <h3 className="text-sm font-semibold text-fg-strong">Notificações</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-accent bg-accent-soft px-2 py-0.5 rounded-full">
                {unreadCount} novas
              </span>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-line-soft">
            {dismissError && <div className="px-4 py-2 text-xs text-danger-fg">{dismissError}</div>}
            {!hasAtLeastOneCategoryEnabled && (
              <div className="p-4 text-center text-xs text-fg-subtle space-y-2">
                <p>Você desabilitou todos os tipos de notificações.</p>
                <button onClick={goToSettings} className="text-xs font-semibold text-accent hover:underline">
                  Ajustar preferências
                </button>
              </div>
            )}
            {notificationsLoading &&
              hasAtLeastOneCategoryEnabled &&
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="px-4 py-3 flex gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-surface-2 shrink-0" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3.5 w-40 bg-surface-2 rounded-full" />
                    <div className="h-3 w-full bg-surface-2 rounded-full" />
                    <div className="h-2.5 w-24 bg-surface-2 rounded-full" />
                  </div>
                </div>
              ))}

            {!notificationsLoading && notificationsError && (
              <div className="p-4 text-center">
                <p className="text-xs text-danger-fg mb-2">{notificationsError}</p>
                <button
                  onClick={refetchNotifications}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!notificationsLoading && !notificationsError && notifications.length === 0 && (
              <div className="p-4 text-center text-xs text-fg-subtle">Nenhuma notificação encontrada.</div>
            )}

            {!notificationsLoading &&
              !notificationsError &&
              notifications.map((item) => {
                const unread = item.status === "UNREAD";
                return (
                  <div key={item.id} className="flex items-start">
                    <button
                      type="button"
                      onClick={() => goToNotification(item.id)}
                      className="flex-1 flex gap-3 px-4 py-3 text-left hover:bg-canvas transition-colors"
                    >
                      <span
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          unread ? "bg-accent-soft text-accent" : "bg-surface-2 text-fg-muted"
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">{iconByCategory(item.category)}</span>
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-fg truncate">{item.name}</p>
                        <p className="text-xs text-fg-muted line-clamp-2">{item.description}</p>
                        <p className="text-[10px] text-fg-subtle mt-1">{formatDateTime(item.createdAt)}</p>
                      </div>
                      {unread && <span className="w-2 h-2 rounded-full bg-accent-solid shrink-0 mt-1.5" aria-hidden />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDismiss(item.id)}
                      disabled={item.status === "DISMISSED" || dismissingId === item.id}
                      className="mx-2 mt-3 p-1.5 rounded-md text-fg-subtle hover:text-danger-ink hover:bg-danger-soft disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
          <div className="px-4 py-2.5 border-t border-line-soft text-center">
            <button
              onClick={goToNotificationsList}
              disabled={!hasAtLeastOneCategoryEnabled}
              className="text-xs font-semibold text-accent hover:underline disabled:text-fg-subtle disabled:no-underline"
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
