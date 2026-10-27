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
    className="text-fg-muted hover:text-accent flex items-center gap-2 text-sm font-medium transition-colors mb-6 w-fit"
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
        <div className="bg-card rounded-xl shadow-card border border-line p-10 flex flex-col items-center text-center gap-3">
          <span className="material-symbols-outlined text-4xl text-danger-fg">error</span>
          <h3 className="text-lg font-bold text-fg-strong">Não foi possível carregar a notificação</h3>
          <p className="text-sm text-fg-subtle">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !notification) {
    return (
      <div>
        <BackLink />
        <div className="bg-card rounded-xl shadow-card border border-line p-8 max-w-2xl animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-surface-2" />
            <div className="space-y-2">
              <div className="h-3 w-24 bg-surface-2 rounded-full" />
              <div className="h-3 w-20 bg-surface-2 rounded-full" />
            </div>
          </div>
          <div className="h-6 w-64 bg-surface-2 rounded-full mb-3" />
          <div className="h-3 w-40 bg-surface-2 rounded-full mb-6" />
          <div className="h-16 w-full bg-surface-2 rounded-lg mb-6" />
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-line-soft">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-2.5 w-20 bg-surface-2 rounded-full" />
                <div className="h-3 w-24 bg-surface-2 rounded-full" />
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
      <div className="bg-card rounded-xl shadow-card border border-line p-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
              unread ? "bg-accent-soft text-accent" : "bg-surface-2 text-fg-muted"
            }`}
          >
            <span className="material-symbols-outlined text-xl">{iconByCategory(notification.category)}</span>
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent-soft px-2 py-0.5 rounded-full">
              {categoryLabel(notification.category)}
            </span>
            {unread && (
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-danger-fg bg-danger-soft px-2 py-0.5 rounded-full">
                Não lida
              </span>
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold text-fg-strong mb-1">{notification.name}</h2>
        <p className="text-xs text-fg-subtle mb-6">{formatDateTime(notification.createdAt)}</p>

        <p className="text-sm text-fg-muted leading-relaxed mb-8">{notification.description}</p>

        {updatingRead && <p className="text-xs text-fg-subtle mb-6">Marcando como lida...</p>}

        {mutationError && (
          <p className="text-xs text-danger-fg mb-4" role="alert">
            {mutationError}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-line-soft pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-fg-subtle">Status</p>
            <p className="text-sm text-fg">{notification.status}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-fg-subtle">Prioridade</p>
            <p className="text-sm text-fg">{notification.priority}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-fg-subtle">Categoria</p>
            <p className="text-sm text-fg">{categoryLabel(notification.category)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-fg-subtle">Referência</p>
            <p className="text-sm text-fg">
              {notification.referenceType && notification.referenceId
                ? `${notification.referenceType} #${notification.referenceId}`
                : notification.referenceType ?? notification.referenceId ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-fg-subtle">Lida em</p>
            <p className="text-sm text-fg">{formatDateTime(notification.readAt)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-fg-subtle">Dispensada em</p>
            <p className="text-sm text-fg">{formatDateTime(notification.dismissedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationDetailPage;
