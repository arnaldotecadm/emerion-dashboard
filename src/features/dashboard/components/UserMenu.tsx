import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export interface UserMenuProps {
  userName: string;
  userEmail?: string;
  onSignOut: () => void;
}

/** Top-right dropdown for account/profile and workspace settings. */
function UserMenu({ userName, userEmail, onSignOut }: UserMenuProps) {
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
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[#eceef0] transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="h-8 w-8 rounded-full overflow-hidden border border-[#c4c6cd] bg-[#e0e3e5] flex items-center justify-center text-[10px] font-bold text-[#44474c]">
          {initials}
        </span>
        <span className="material-symbols-outlined text-lg text-[#44474c]">expand_more</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-[0px_8px_24px_rgba(26,43,60,0.15)] border border-[#e6e8ea] overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-[#eceef0]">
            <p className="text-sm font-semibold text-[#041627] truncate">{userName}</p>
            {userEmail && <p className="text-xs text-[#44474c] truncate">{userEmail}</p>}
          </div>
          <nav className="py-1">
            <Link
              to="/dashboard/conta"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#191c1e] hover:bg-[#f7f9fb] transition-colors"
              role="menuitem"
            >
              <span className="material-symbols-outlined text-lg text-[#44474c]">
                manage_accounts
              </span>
              Minha Conta
            </Link>
            <Link
              to="/dashboard/configuracoes"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#191c1e] hover:bg-[#f7f9fb] transition-colors"
              role="menuitem"
            >
              <span className="material-symbols-outlined text-lg text-[#44474c]">settings</span>
              Preferências
            </Link>
          </nav>
          <div className="py-1 border-t border-[#eceef0]">
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
