import { useEffect, useRef, useState } from "react";
import Tooltip from "../../../components/Tooltip";

interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    icon: "credit_card_off",
    title: "Limite de crédito excedido",
    description: "Distribuidora Alfa Ltda. ultrapassou o teto permitido.",
    time: "5 min atrás",
    unread: true,
  },
  {
    id: "n2",
    icon: "receipt_long",
    title: "Novo pedido recebido",
    description: "Pedido #ORD-90245 aguardando aprovação.",
    time: "22 min atrás",
    unread: true,
  },
  {
    id: "n3",
    icon: "inventory_2",
    title: "Estoque baixo",
    description: "5 itens da Curva A abaixo do estoque de segurança.",
    time: "1 h atrás",
    unread: true,
  },
  {
    id: "n4",
    icon: "task_alt",
    title: "Meta batida",
    description: "Carlos Eduardo S. atingiu 105% da meta do mês.",
    time: "3 h atrás",
  },
];

/** Top-right dropdown showing the latest system notifications. */
function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

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
            {NOTIFICATIONS.map((item) => (
              <div key={item.id} className="flex gap-3 px-4 py-3 hover:bg-[#f7f9fb] transition-colors">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    item.unread ? "bg-[#cce5ff] text-[#006397]" : "bg-[#eceef0] text-[#44474c]"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#191c1e] truncate">{item.title}</p>
                  <p className="text-xs text-[#44474c] line-clamp-2">{item.description}</p>
                  <p className="text-[10px] text-[#8192a7] mt-1">{item.time}</p>
                </div>
                {item.unread && (
                  <span className="w-2 h-2 rounded-full bg-[#006397] shrink-0 mt-1.5" aria-hidden />
                )}
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-[#eceef0] text-center">
            <button className="text-xs font-semibold text-[#006397] hover:underline">
              Ver todas as notificações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsMenu;
