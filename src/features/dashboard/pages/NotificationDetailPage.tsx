import { useParams } from "react-router-dom";
import PlaceholderPage from "../components/PlaceholderPage";
import { getNotificationById } from "../data/notificationsData";

/** Detail view for a single notification, reached from the notifications dropdown. */
function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const notification = getNotificationById(id);

  if (!notification) {
    return (
      <PlaceholderPage
        icon="notifications_off"
        title="Notificação não encontrada"
        description="A notificação solicitada não existe ou já foi removida."
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card border border-[#e6e8ea] p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
            notification.unread ? "bg-[#cce5ff] text-[#006397]" : "bg-[#eceef0] text-[#44474c]"
          }`}
        >
          <span className="material-symbols-outlined text-xl">{notification.icon}</span>
        </span>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#006397] bg-[#cce5ff] px-2 py-0.5 rounded-full">
            {notification.category}
          </span>
          {notification.unread && (
            <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#ba1a1a] bg-[#fddede] px-2 py-0.5 rounded-full">
              Não lida
            </span>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold text-[#041627] mb-1">{notification.name}</h2>
      <p className="text-xs text-[#8192a7] mb-6">{notification.time}</p>

      <p className="text-sm text-[#44474c] leading-relaxed mb-8">{notification.description}</p>

      <div className="grid grid-cols-3 gap-4 border-t border-[#eceef0] pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8192a7]">ID</p>
          <p className="text-sm text-[#191c1e]">{notification.id}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8192a7]">Referência</p>
          <p className="text-sm text-[#191c1e]">{notification.reference}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8192a7]">Categoria</p>
          <p className="text-sm text-[#191c1e]">{notification.category}</p>
        </div>
      </div>
    </div>
  );
}

export default NotificationDetailPage;
