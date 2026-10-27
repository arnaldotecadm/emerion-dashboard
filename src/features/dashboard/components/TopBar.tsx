import { useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";
import NotificationsMenu from "./NotificationsMenu";
import HelpTip from "./HelpTip";
import ThemeToggle from "../../../theme/ThemeToggle";
import { useCustomer } from "../hooks/useCustomer";
import { useNotification } from "../hooks/useNotification";

export interface TopBarProps {
  userName: string;
  userEmail?: string;
  userGroups?: string[];
  onSignOut: () => void;
  sidebarCollapsed: boolean;
}

/** Maps each dashboard route to the page title shown in the top bar. */
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Visão Geral",
  "/dashboard/vendas": "Vendas Totais",
  "/dashboard/pedidos": "Pedidos",
  "/dashboard/clientes": "Clientes",
  "/dashboard/vendedores": "Vendedores",
  "/dashboard/notificacoes": "Notificações",
  "/dashboard/configuracoes": "Configurações",
  "/dashboard/conta": "Perfil do Usuário",
};

const DEFAULT_TITLE = "Emerion Dashboard";

/** Sticky top bar showing the current page's title and the account menu. */
function TopBar({
  userName,
  userEmail,
  userGroups,
  onSignOut,
  sidebarCollapsed,
}: TopBarProps) {
  const location = useLocation();
  const clienteMatch = location.pathname.match(/^\/dashboard\/clientes\/(.+)$/);
  const clienteId = clienteMatch?.[1];
  const { data: cliente } = useCustomer(clienteId);

  const notificacaoMatch = location.pathname.match(/^\/dashboard\/notificacoes\/(.+)$/);
  const notificacaoId = notificacaoMatch?.[1];
  const { data: notificacao } = useNotification(notificacaoId);

  const title = clienteId
    ? (cliente?.nomeFantasia.trim() ?? "Detalhes do Cliente")
    : notificacaoMatch
      ? (notificacao?.name ?? "Notificação")
      : (PAGE_TITLES[location.pathname] ?? DEFAULT_TITLE);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between bg-canvas pr-6 shadow-card transition-[padding] duration-300 ${
        sidebarCollapsed ? "pl-20" : "pl-72"
      }`}
    >
      <h1 className="text-2xl font-semibold text-fg-strong">{title}</h1>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NotificationsMenu />
        <HelpTip />
        <UserMenu userName={userName} userEmail={userEmail} userGroups={userGroups} onSignOut={onSignOut} />
      </div>
    </header>
  );
}

export default TopBar;
