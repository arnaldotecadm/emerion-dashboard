import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideNav from "./components/SideNav";
import TopBar from "./components/TopBar";

export interface DashboardOutletContext {
  userName: string;
  userEmail?: string;
  /** Cognito user pool group memberships (from the `cognito:groups` ID token claim), if any. */
  userGroups?: string[];
  userId?: string;
  userPhone?: string;
  userEmailVerified?: boolean;
}

export interface DashboardLayoutProps {
  /** Display name or email of the signed-in user, sourced from `auth.user?.profile`. */
  userName: string;
  userEmail?: string;
  /** Cognito user pool group memberships (from the `cognito:groups` ID token claim), if any. */
  userGroups?: string[];
  userId?: string;
  userPhone?: string;
  userEmailVerified?: boolean;
  /** Calls `auth.removeUser()` / Cognito sign-out redirect. */
  onSignOut: () => void;
}

/**
 * Persistent authenticated shell: side navigation + top bar, with the active
 * route's page rendered via <Outlet />. Shown when `auth.isAuthenticated` is true.
 */
function DashboardLayout({
  userName,
  userEmail,
  userGroups,
  userId,
  userPhone,
  userEmailVerified,
  onSignOut,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="bg-canvas text-fg min-h-screen">
      <SideNav
        onSignOut={onSignOut}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <TopBar
        userName={userName}
        userEmail={userEmail}
        userGroups={userGroups}
        onSignOut={onSignOut}
        sidebarCollapsed={sidebarCollapsed}
      />
      <main
        className={`pr-6 pt-24 pb-12 transition-[padding] duration-300 ${
          sidebarCollapsed ? "pl-20" : "pl-72"
        }`}
      >
        <Outlet
          context={{
            userName,
            userEmail,
            userGroups,
            userId,
            userPhone,
            userEmailVerified,
          } satisfies DashboardOutletContext}
        />
      </main>
    </div>
  );
}

export default DashboardLayout;
