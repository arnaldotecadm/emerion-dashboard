import UserMenu from "./UserMenu";

export interface TopBarProps {
  userName: string;
  userEmail?: string;
  onSignOut: () => void;
}

/** Sticky top bar with period/regional filters and the signed-in user's account menu. */
function TopBar({ userName, userEmail, onSignOut }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center pl-72 pr-6 h-16 bg-[#f7f9fb] shadow-[0px_4px_12px_rgba(26,43,60,0.05)]">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-semibold text-[#041627]">Emerion Dashboard</span>
        <nav className="hidden md:flex gap-6">
          <a
            className="text-[#006397] font-bold border-b-2 border-[#006397] h-16 flex items-center"
            href="#"
          >
            Período
          </a>
          <a
            className="text-[#44474c] hover:text-[#006397] transition-colors h-16 flex items-center"
            href="#"
          >
            Regional
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-[#44474c] hover:bg-[#eceef0] rounded-full" aria-label="Notificações">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-2 text-[#44474c] hover:bg-[#eceef0] rounded-full" aria-label="Ajuda">
          <span className="material-symbols-outlined">help</span>
        </button>
        <UserMenu userName={userName} userEmail={userEmail} onSignOut={onSignOut} />
      </div>
    </header>
  );
}

export default TopBar;
