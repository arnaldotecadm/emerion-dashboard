import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./features/dashboard/DashboardLayout";
import VisaoGeralPage from "./features/dashboard/pages/VisaoGeralPage";
import VendasTotaisPage from "./features/dashboard/pages/VendasTotaisPage";
import PedidosPage from "./features/dashboard/pages/PedidosPage";
import PedidoDetailPage from "./features/dashboard/pages/PedidoDetailPage";
import ClientesPage from "./features/dashboard/pages/ClientesPage";
import ClienteDetailPage from "./features/dashboard/pages/ClienteDetailPage";
import VendedoresPage from "./features/dashboard/pages/VendedoresPage";
import VendedorDetailPage from "./features/dashboard/pages/VendedorDetailPage";
import ProdutosPage from "./features/dashboard/pages/ProdutosPage";
import ProdutoDetailPage from "./features/dashboard/pages/ProdutoDetailPage";
import ConfiguracoesPage from "./features/dashboard/pages/ConfiguracoesPage";
import NotificacoesPage from "./features/dashboard/pages/NotificacoesPage";
import NotificationDetailPage from "./features/dashboard/pages/NotificationDetailPage";
import AccountPage from "./features/account/AccountPage";
import { setAuthToken } from "./features/dashboard/services/apiConfig";

function App() {
  const auth = useAuth();

  // Keeps the ERP API client's JWT in sync with the Cognito session, so every
  // request carries a valid `Authorization: Bearer` header for the backend to validate.
  useEffect(() => {
    setAuthToken(auth.user?.access_token ?? null);
  }, [auth.user]);

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
  // Cognito exposes the user's group membership via the "cognito:groups" claim
  // on the ID token (populated from the user pool's group assignments).
  const rawGroups = profile?.["cognito:groups"];
  const userGroups = Array.isArray(rawGroups) ? (rawGroups as string[]) : undefined;
  const handleSignOut = () => {
    auth.removeUser();
    signOutRedirect();
  };

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <DashboardLayout
            userName={userName}
            userEmail={profile?.email}
            userGroups={userGroups}
            onSignOut={handleSignOut}
          />
        }
      >
        <Route index element={<VisaoGeralPage />} />
        <Route path="vendas" element={<VendasTotaisPage />} />
        <Route path="pedidos" element={<PedidosPage />} />
        <Route path="pedidos/:id" element={<PedidoDetailPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="clientes/:id" element={<ClienteDetailPage />} />
        <Route path="vendedores" element={<VendedoresPage />} />
        <Route path="vendedores/:id" element={<VendedorDetailPage />} />
        <Route path="produtos" element={<ProdutosPage />} />
        <Route path="produtos/:id" element={<ProdutoDetailPage />} />
        <Route path="configuracoes" element={<ConfiguracoesPage />} />
        <Route path="notificacoes" element={<NotificacoesPage />} />
        <Route path="notificacoes/:id" element={<NotificationDetailPage />} />
        <Route path="conta" element={<AccountPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App
