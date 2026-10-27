import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export interface UserMenuProps {
  userName: string;
  userEmail?: string;
  userGroups?: string[];
  onSignOut: () => void;
}

/** Top-right dropdown for account/profile and workspace settings. */
function UserMenu({ userName, userEmail, userGroups, onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initials = userName.slice(0, 2).toUpperCase();

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
    <div className="relative ml-2" ref={containerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-surface-2 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="h-8 w-8 rounded-full overflow-hidden border border-line-strong bg-surface-3 flex items-center justify-center text-[10px] font-bold text-fg-muted">
          {initials}
        </span>
        <span className="material-symbols-outlined text-lg text-fg-muted">expand_more</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 bg-card rounded-xl shadow-popover border border-line overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-line-soft">
            <p className="text-sm font-semibold text-fg-strong truncate">{userName}</p>
            {userEmail && <p className="text-xs text-fg-muted truncate">{userEmail}</p>}
            {userGroups && userGroups.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {userGroups.map((group) => (
                  <span
                    key={group}
                    className="px-2 py-0.5 rounded-full bg-accent-tint text-accent text-[10px] font-semibold uppercase tracking-wide"
                  >
                    {group}
                  </span>
                ))}
              </div>
            )}
          </div>
          <nav className="py-1">
            <Link
              to="/dashboard/conta"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-fg hover:bg-canvas transition-colors"
              role="menuitem"
            >
              <span className="material-symbols-outlined text-lg text-fg-muted">
                manage_accounts
              </span>
              Perfil do Usuário
            </Link>
            <Link
              to="/dashboard/configuracoes"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-fg hover:bg-canvas transition-colors"
              role="menuitem"
            >
              <span className="material-symbols-outlined text-lg text-fg-muted">settings</span>
              Preferências
            </Link>
          </nav>
          <div className="py-1 border-t border-line-soft">
            <button
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
              role="menuitem"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
