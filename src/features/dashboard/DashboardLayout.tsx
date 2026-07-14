import { Outlet } from "react-router-dom";
import SideNav from "./components/SideNav";
import TopBar from "./components/TopBar";

export interface DashboardOutletContext {
  userName: string;
  userEmail?: string;
  /** Cognito user pool group memberships (from the `cognito:groups` ID token claim), if any. */
  userGroups?: string[];
}

export interface DashboardLayoutProps {
  /** Display name or email of the signed-in user, sourced from `auth.user?.profile`. */
  userName: string;
  userEmail?: string;
  /** Cognito user pool group memberships (from the `cognito:groups` ID token claim), if any. */
  userGroups?: string[];
  /** Calls `auth.removeUser()` / Cognito sign-out redirect. */
  onSignOut: () => void;
}

/**
 * Persistent authenticated shell: side navigation + top bar, with the active
 * route's page rendered via <Outlet />. Shown when `auth.isAuthenticated` is true.
 */
function DashboardLayout({ userName, userEmail, userGroups, onSignOut }: DashboardLayoutProps) {
  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      <SideNav onSignOut={onSignOut} />
      <TopBar userName={userName} userEmail={userEmail} userGroups={userGroups} onSignOut={onSignOut} />
      <main className="pl-72 pr-6 pt-24 pb-12">
        <Outlet context={{ userName, userEmail, userGroups } satisfies DashboardOutletContext} />
      </main>
    </div>
  );
}

export default DashboardLayout;

