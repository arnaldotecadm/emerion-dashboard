import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./features/dashboard/DashboardLayout";
import VisaoGeralPage from "./features/dashboard/pages/VisaoGeralPage";
import PedidosPage from "./features/dashboard/pages/PedidosPage";
import ClientesPage from "./features/dashboard/pages/ClientesPage";
import VendedoresPage from "./features/dashboard/pages/VendedoresPage";
import ConfiguracoesPage from "./features/dashboard/pages/ConfiguracoesPage";
import AccountPage from "./features/account/AccountPage";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "395rpr7l5274ei0ivbjm6l2ptd";
    const logoutUri = "http://localhost:5173/logout";
    const cognitoDomain = "https://eu-north-1ntdqlsmut.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<LandingPage onSignIn={() => auth.signinRedirect()} />} />
      </Routes>
    );
  }

  const profile = auth.user?.profile;
  const userName = profile?.name ?? profile?.email ?? "there";
  const handleSignOut = () => {
    auth.removeUser();
    signOutRedirect();
  };

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <DashboardLayout userName={userName} userEmail={profile?.email} onSignOut={handleSignOut} />
        }
      >
        <Route index element={<VisaoGeralPage />} />
        <Route path="pedidos" element={<PedidosPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="vendedores" element={<VendedoresPage />} />
        <Route path="configuracoes" element={<ConfiguracoesPage />} />
        <Route path="conta" element={<AccountPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App
