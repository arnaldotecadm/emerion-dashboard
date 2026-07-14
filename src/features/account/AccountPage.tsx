import { useOutletContext } from "react-router-dom";
import PlaceholderPage from "../dashboard/components/PlaceholderPage";
import type { DashboardOutletContext } from "../dashboard/DashboardLayout";

/** "Minha Conta" — account/profile management, reached via the top-right user menu. */
function AccountPage() {
  const { userName, userEmail, userGroups } = useOutletContext<DashboardOutletContext>();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-card flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-[#e0e3e5] flex items-center justify-center text-lg font-bold text-[#44474c]">
          {userName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#041627]">{userName}</h2>
          {userEmail && <p className="text-sm text-[#44474c]">{userEmail}</p>}
          {userGroups && userGroups.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {userGroups.map((group) => (
                <span
                  key={group}
                  className="px-2 py-0.5 rounded-full bg-[#e3f2fa] text-[#006397] text-[10px] font-semibold uppercase tracking-wide"
                >
                  {group}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <PlaceholderPage
        icon="manage_accounts"
        title="Minha Conta"
        description="A edição de perfil, segurança e preferências de notificação estarão disponíveis aqui em breve."
      />
    </div>
  );
}

export default AccountPage;
