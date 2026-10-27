import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import LoginPage from "./pages/login/LoginPage";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./features/dashboard/DashboardLayout";
import VisaoGeralPage from "./features/dashboard/pages/VisaoGeralPage";
import DashboardAccessDeniedPage from "./features/dashboard/pages/DashboardAccessDeniedPage";
import VendasTotaisPage from "./features/dashboard/pages/VendasTotaisPage";
import PedidosPage from "./features/dashboard/pages/PedidosPage";
import PedidoDetailPage from "./features/dashboard/pages/PedidoDetailPage";
import ClientesPage from "./features/dashboard/pages/ClientesPage";
import ClienteDetailPage from "./features/dashboard/pages/ClienteDetailPage";
import VendedoresPage from "./features/dashboard/pages/VendedoresPage";
import VendedorDetailPage from "./features/dashboard/pages/VendedorDetailPage";
import ProdutosPage from "./features/dashboard/pages/ProdutosPage";
import ProdutoDetailPage from "./features/dashboard/pages/ProdutoDetailPage";
import InteligenciaEstoquePage from "./features/dashboard/pages/InteligenciaEstoquePage";
import ConfiguracoesPage from "./features/dashboard/pages/ConfiguracoesPage";
import NotificacoesPage from "./features/dashboard/pages/NotificacoesPage";
import NotificationDetailPage from "./features/dashboard/pages/NotificationDetailPage";
import PerfilUsuario from "./features/account/PerfilUsuario";
import { setAuthToken } from "./features/dashboard/services/apiConfig";

const CockpitExecutivoPage = lazy(() => import("./features/dashboard/pages/CockpitExecutivoPage"));

function App() {
  const auth = useAuth();
  const navigate = useNavigate();

  // Keeps the ERP API client's JWT in sync with the Cognito session, so every
  // request carries a valid `Authorization: Bearer` header for the backend to validate.
  useEffect(() => {
    setAuthToken(auth.user?.access_token ?? null);
  }, [auth.user]);

  if (auth.isLoading) {
    return <div className="min-h-screen bg-canvas" />;
  }

  if (!auth.isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<LandingPage onSignIn={() => navigate("/login")} />} />
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
    auth.signOut();
    navigate("/login", { replace: true });
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
            userId={profile?.sub}
            userPhone={profile?.phone_number}
            userEmailVerified={profile?.email_verified}
            onSignOut={handleSignOut}
          />
        }
      >
        <Route index element={<VisaoGeralPage />} />
        <Route path="access-denied" element={<DashboardAccessDeniedPage />} />
        <Route path="vendas" element={<VendasTotaisPage />} />
        <Route path="pedidos" element={<PedidosPage />} />
        <Route path="pedidos/:id" element={<PedidoDetailPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="clientes/:id" element={<ClienteDetailPage />} />
        <Route path="vendedores" element={<VendedoresPage />} />
        <Route path="vendedores/:id" element={<VendedorDetailPage />} />
        <Route path="produtos" element={<ProdutosPage />} />
        <Route path="produtos/:id" element={<ProdutoDetailPage />} />
        <Route path="estoque" element={<InteligenciaEstoquePage />} />
        <Route
          path="cockpit"
          element={
            <Suspense fallback={<div className="text-sm text-fg-subtle">Carregando Cockpit Executivo...</div>}>
              <CockpitExecutivoPage />
            </Suspense>
          }
        />
        <Route path="configuracoes" element={<ConfiguracoesPage />} />
        <Route path="notificacoes" element={<NotificacoesPage />} />
        <Route path="notificacoes/:id" element={<NotificationDetailPage />} />
        <Route path="conta" element={<PerfilUsuario />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App
