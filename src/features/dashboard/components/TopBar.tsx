import { useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";
import NotificationsMenu from "./NotificationsMenu";
import HelpTip from "./HelpTip";

export interface TopBarProps {
  userName: string;
  userEmail?: string;
  userGroups?: string[];
  onSignOut: () => void;
}

/** Maps each dashboard route to the page title shown in the top bar. */
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Visão Geral",
  "/dashboard/vendas": "Vendas Totais",
  "/dashboard/pedidos": "Pedidos",
  "/dashboard/clientes": "Clientes",
  "/dashboard/vendedores": "Vendedores",
  "/dashboard/configuracoes": "Configurações",
  "/dashboard/conta": "Minha Conta",
};

const DEFAULT_TITLE = "Emerion Dashboard";

/** Sticky top bar showing the current page's title and the account menu. */
function TopBar({ userName, userEmail, userGroups, onSignOut }: TopBarProps) {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? DEFAULT_TITLE;

  return (
    <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center pl-72 pr-6 h-16 bg-[#f7f9fb] shadow-card">
      <h1 className="text-2xl font-semibold text-[#041627]">{title}</h1>
      <div className="flex items-center gap-4">
        <NotificationsMenu />
        <HelpTip />
        <UserMenu userName={userName} userEmail={userEmail} userGroups={userGroups} onSignOut={onSignOut} />
      </div>
    </header>
  );
}

export default TopBar;
