import { Link, NavLink } from "react-router-dom";

export interface SideNavProps {
  onSignOut: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const NAV_ITEMS = [
  { to: "/dashboard", icon: "dashboard", label: "Visão Geral", end: true },
  { to: "/dashboard/cockpit", icon: "monitoring", label: "Cockpit Executivo & Funil de Vendas" },
  { to: "/dashboard/vendas", icon: "trending_up", label: "Vendas Totais" },
  { to: "/dashboard/pedidos", icon: "receipt_long", label: "Pedidos" },
  { to: "/dashboard/clientes", icon: "groups", label: "Clientes" },
  { to: "/dashboard/vendedores", icon: "person_search", label: "Vendedores" },
  { to: "/dashboard/produtos", icon: "inventory_2", label: "Produtos" },
  { to: "/dashboard/estoque", icon: "inventory", label: "Inteligência de Estoque & Reposição" },
  { to: "/dashboard/configuracoes", icon: "settings", label: "Configurações" },
];

const navLinkClasses = (isActive: boolean, collapsed: boolean) =>
  `group relative mx-2 flex items-center rounded-lg py-3 transition-all ${
    collapsed ? "justify-center px-0" : "gap-3 px-4"
  } ${
    isActive
      ? "bg-[#006397] text-white"
      : "text-white/70 hover:bg-white/10 hover:text-white"
  }`;

/** Persistent left navigation for the executive dashboard. */
function SideNav({ onSignOut, collapsed, onToggleCollapsed }: SideNavProps) {
  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-full flex-col bg-[#041627] py-6 text-white shadow-md transition-[width] duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className={`mb-8 flex shrink-0 items-center border-b border-white/10 px-3 pb-4 ${
          collapsed ? "flex-col gap-3" : "justify-between px-6"
        }`}
      >
        <Link
          to="/dashboard"
          aria-label="Emerion Dashboard"
          title={collapsed ? "Emerion Dashboard" : undefined}
          className="block shrink-0 transition-opacity hover:opacity-90"
        >
          {collapsed ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006397] text-lg font-bold text-white">
              E
            </span>
          ) : (
            <>
              <h1 className="text-xl font-semibold leading-7 text-white">
                Emerion Dashboard
              </h1>
              <p className="text-xs font-semibold tracking-wide text-white/60">
                Brasil Corporate
              </p>
            </>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {collapsed ? "menu" : "menu_open"}
          </span>
        </button>
      </div>

      {/* Scrollable so nav items never push Suporte/Sair off-screen on short viewports */}
      <nav aria-label="Navegação principal" className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            aria-label={item.label}
            className={({ isActive }) => navLinkClasses(isActive, collapsed)}
          >
            <span className="material-symbols-outlined shrink-0" aria-hidden="true">
              {item.icon}
            </span>
            {!collapsed && <span className="text-sm leading-tight">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div
        className={`mt-2 shrink-0 space-y-2 border-t border-white/10 pt-4 ${
          collapsed ? "px-1.5" : "px-2"
        }`}
      >
        <a
          href={`https://wa.me/351910399047?text=${encodeURIComponent("Ola, estou com uma duvida sobre o sistema")}`}
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? "Suporte" : undefined}
          aria-label="Abrir suporte no WhatsApp"
          className={`group flex w-full items-center rounded-lg border border-white/10 bg-white/5 py-3 text-left text-white/80 shadow-sm transition-all hover:border-white/20 hover:bg-white/15 hover:text-white ${
            collapsed ? "justify-center px-0" : "gap-3 px-4"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#006397]/30 transition-colors group-hover:bg-[#006397]/50">
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              support_agent
            </span>
          </span>
          {!collapsed && <span className="text-sm font-medium">Suporte</span>}
        </a>
        <button
          onClick={onSignOut}
          title={collapsed ? "Sair" : undefined}
          aria-label="Sair"
          className={`group flex w-full items-center rounded-lg border border-red-400/20 bg-red-500/10 py-3 text-left text-red-300 shadow-sm transition-all hover:border-red-400/40 hover:bg-red-500/80 hover:text-white ${
            collapsed ? "justify-center px-0" : "gap-3 px-4"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20 transition-colors group-hover:bg-white/20">
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              logout
            </span>
          </span>
          {!collapsed && <span className="text-sm font-semibold">Sair</span>}
        </button>
      </div>
    </aside>
  );
}

export default SideNav;
