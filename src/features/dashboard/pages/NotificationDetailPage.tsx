import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PlaceholderPage from "../components/PlaceholderPage";
import { useNotification } from "../hooks/useNotification";
import { markNotificationAsRead } from "../services/notificationService";
import { formatDateTime } from "../utils/format";
import type { Notification } from "../types/notification";

const BackLink = () => (
  <Link
    to="/dashboard/notificacoes"
    className="text-[#44474c] hover:text-[#006397] flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
  >
    <span className="material-symbols-outlined text-base">arrow_back</span>
    Voltar para Notificações
  </Link>
);

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

function categoryLabel(category: Notification["category"]): string {
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

/** Detail view for a single notification, reached from the notifications dropdown. */
function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: notification, loading, error, notFound, refetch } = useNotification(id);
  const [updatingRead, setUpdatingRead] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const autoReadDoneRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id || !notification || notification.readAt) return;
    if (autoReadDoneRef.current === id || updatingRead) return;

    autoReadDoneRef.current = id;
    setUpdatingRead(true);
    setMutationError(null);

    markNotificationAsRead(id)
      .then(() => refetch())
      .catch((err: unknown) => {
        autoReadDoneRef.current = null;
        setMutationError(err instanceof Error ? err.message : "Não foi possível marcar a notificação como lida.");
      })
      .finally(() => setUpdatingRead(false));
  }, [id, notification, refetch, updatingRead]);

  if (notFound) {
    return (
      <div>
        <BackLink />
        <PlaceholderPage
          icon="notifications_off"
          title="Notificação não encontrada"
          description="A notificação solicitada não existe ou já foi removida."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <BackLink />
        <div className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-10 flex flex-col items-center text-center gap-3">
          <span className="material-symbols-outlined text-4xl text-[#ba1a1a]">error</span>
          <h3 className="text-lg font-bold text-[#041627]">Não foi possível carregar a notificação</h3>
          <p className="text-sm text-[#8192a7]">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !notification) {
    return (
      <div>
        <BackLink />
        <div className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-8 max-w-2xl animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-[#eceef0]" />
            <div className="space-y-2">
              <div className="h-3 w-24 bg-[#eceef0] rounded-full" />
              <div className="h-3 w-20 bg-[#eceef0] rounded-full" />
            </div>
          </div>
          <div className="h-6 w-64 bg-[#eceef0] rounded-full mb-3" />
          <div className="h-3 w-40 bg-[#eceef0] rounded-full mb-6" />
          <div className="h-16 w-full bg-[#eceef0] rounded-lg mb-6" />
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#eceef0]">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-2.5 w-20 bg-[#eceef0] rounded-full" />
                <div className="h-3 w-24 bg-[#eceef0] rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const unread = notification.status === "UNREAD";

  return (
    <div>
      <BackLink />
      <div className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
              unread ? "bg-[#cce5ff] text-[#006397]" : "bg-[#eceef0] text-[#44474c]"
            }`}
          >
            <span className="material-symbols-outlined text-xl">{iconByCategory(notification.category)}</span>
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006397] bg-[#cce5ff] px-2 py-0.5 rounded-full">
              {categoryLabel(notification.category)}
            </span>
            {unread && (
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#ba1a1a] bg-[#fddede] px-2 py-0.5 rounded-full">
                Não lida
              </span>
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold text-[#041627] mb-1">{notification.name}</h2>
        <p className="text-xs text-[#8192a7] mb-6">{formatDateTime(notification.createdAt)}</p>

        <p className="text-sm text-[#44474c] leading-relaxed mb-8">{notification.description}</p>

        {updatingRead && <p className="text-xs text-[#8192a7] mb-6">Marcando como lida...</p>}

        {mutationError && (
          <p className="text-xs text-[#ba1a1a] mb-4" role="alert">
            {mutationError}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-[#eceef0] pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8192a7]">Status</p>
            <p className="text-sm text-[#191c1e]">{notification.status}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8192a7]">Prioridade</p>
            <p className="text-sm text-[#191c1e]">{notification.priority}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8192a7]">Categoria</p>
            <p className="text-sm text-[#191c1e]">{categoryLabel(notification.category)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8192a7]">Referência</p>
            <p className="text-sm text-[#191c1e]">
              {notification.referenceType && notification.referenceId
                ? `${notification.referenceType} #${notification.referenceId}`
                : notification.referenceType ?? notification.referenceId ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8192a7]">Lida em</p>
            <p className="text-sm text-[#191c1e]">{formatDateTime(notification.readAt)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8192a7]">Dispensada em</p>
            <p className="text-sm text-[#191c1e]">{formatDateTime(notification.dismissedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationDetailPage;
