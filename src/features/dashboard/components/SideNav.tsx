import { Link, NavLink } from "react-router-dom";

export interface SideNavProps {
  onSignOut: () => void;
}

const NAV_ITEMS = [
  { to: "/dashboard", icon: "dashboard", label: "Visão Geral", end: true },
  { to: "/dashboard/vendas", icon: "trending_up", label: "Vendas Totais" },
  { to: "/dashboard/pedidos", icon: "receipt_long", label: "Pedidos" },
  { to: "/dashboard/clientes", icon: "groups", label: "Clientes" },
  { to: "/dashboard/vendedores", icon: "person_search", label: "Vendedores" },
  { to: "/dashboard/configuracoes", icon: "settings", label: "Configurações" },
];

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "flex items-center gap-3 px-4 py-3 mx-2 bg-[#006397] text-white rounded-lg scale-95 transition-all"
    : "flex items-center gap-3 px-4 py-3 mx-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all";

/** Persistent left navigation for the executive dashboard. */
function SideNav({ onSignOut }: SideNavProps) {
  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col py-6 z-50 bg-[#041627] w-64 shadow-md">
      <Link to="/dashboard" className="px-6 mb-8 shrink-0 block hover:opacity-90 transition-opacity">
        <h1 className="text-xl font-semibold leading-7 text-white">Emerion Dashboard</h1>
        <p className="text-xs font-semibold tracking-wide text-white/60">Brasil Corporate</p>
      </Link>

      {/* Scrollable so nav items never push Suporte/Sair off-screen on short viewports */}
      <nav className="flex-1 min-h-0 overflow-y-auto space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.label} to={item.to} end={item.end} className={navLinkClasses}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 px-2 pt-4 mt-2 border-t border-white/10 space-y-2">
        <a
          href="#"
          className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 text-white/80 hover:text-white hover:bg-white/15 border border-white/10 hover:border-white/20 shadow-sm transition-all"
        >
          <span className="w-8 h-8 rounded-full bg-[#006397]/30 group-hover:bg-[#006397]/50 flex items-center justify-center shrink-0 transition-colors">
            <span className="material-symbols-outlined text-lg">support_agent</span>
          </span>
          <span className="text-sm font-medium">Suporte</span>
        </a>
        <button
          onClick={onSignOut}
          className="group flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left bg-red-500/10 text-red-300 hover:text-white hover:bg-red-500/80 border border-red-400/20 hover:border-red-400/40 shadow-sm transition-all"
        >
          <span className="w-8 h-8 rounded-full bg-red-500/20 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
            <span className="material-symbols-outlined text-lg">logout</span>
          </span>
          <span className="text-sm font-semibold">Sair</span>
        </button>
      </div>
    </aside>
  );
}

export default SideNav;
