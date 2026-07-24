import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tooltip from "../../../components/Tooltip";
import { useNotifications } from "../hooks/useNotifications";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const notificationsQuery = useNotifications(0, 10);
  const unreadQuery = useNotifications(0, 1, "UNREAD");

  const notifications = notificationsQuery.data?.data ?? [];
  const unreadCount = unreadQuery.data?.pagination.total ?? 0;

  const goToNotification = (id: number) => {
    setOpen(false);
    navigate(`/dashboard/notificacoes/${id}`);
  };

  const goToNotificationsList = () => {
    setOpen(false);
    navigate("/dashboard/notificacoes");
  };

  useEffect(() => {
    if (!open) return;

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
  }, [open]);

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
            {notificationsQuery.loading &&
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
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToNotification(item.id)}
                    className="w-full flex gap-3 px-4 py-3 text-left hover:bg-[#f7f9fb] transition-colors"
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
                );
              })}
          </div>
          <div className="px-4 py-2.5 border-t border-[#eceef0] text-center">
            <button onClick={goToNotificationsList} className="text-xs font-semibold text-[#006397] hover:underline">
              Ver todas as notificações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsMenu;
