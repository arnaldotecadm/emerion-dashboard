import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../../theme/ThemeToggle";
import LoginBrandPanel from "./LoginBrandPanel";
import SignInForm from "./SignInForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

export type LoginView = "signin" | "forgot";

/** Custom Emerion sign-in page backed directly by the Cognito user pool. */
function LoginPage() {
  const [view, setView] = useState<LoginView>("signin");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-canvas text-fg" data-testid="login-page">
      <LoginBrandPanel />
      <main className="relative flex flex-1 flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-medium text-fg-muted transition-colors hover:text-accent"
            data-testid="login-back-home-link"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Voltar ao site
          </Link>
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <div key={view} className="animate-[login-rise_0.4s_ease-out]">
            {view === "signin" ? (
              <SignInForm
                email={email}
                onEmailChange={setEmail}
                notice={notice}
                onForgot={() => {
                  setNotice(null);
                  setView("forgot");
                }}
              />
            ) : (
              <ForgotPasswordForm
                email={email}
                onEmailChange={setEmail}
                onBack={() => setView("signin")}
                onDone={() => {
                  setNotice("Senha alterada com sucesso. Entre com a nova senha.");
                  setView("signin");
                }}
              />
            )}
          </div>
        </div>

        <p className="text-center text-xs text-fg-subtle">
          © {new Date().getFullYear()} Emerion · Acesso restrito a usuários autorizados
        </p>
      </main>
    </div>
  );
}

export default LoginPage;
