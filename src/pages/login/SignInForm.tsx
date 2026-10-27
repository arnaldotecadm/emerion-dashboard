import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { authErrorMessage } from "../../auth/cognito";
import { Field, FormMessage, PasswordField, SubmitButton } from "./fields";

interface SignInFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  notice: string | null;
  onForgot: () => void;
}

function SignInForm({ email, onEmailChange, notice, onForgot }: SignInFormProps) {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6" data-testid="signin-form">
      <div>
        <h1 className="text-3xl font-semibold text-fg-strong">Bem-vindo de volta</h1>
        <p className="mt-2 text-sm text-fg-muted">Entre com seu e-mail corporativo para acessar o painel.</p>
      </div>

      {notice && <FormMessage kind="success" testId="signin-notice">{notice}</FormMessage>}
      {error && <FormMessage kind="error" testId="signin-error">{error}</FormMessage>}

      <Field
        id="signin-email"
        data-testid="signin-email-input"
        label="E-mail"
        icon="mail"
        type="email"
        autoComplete="username"
        placeholder="voce@empresa.com.br"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
        autoFocus
      />
      <div className="space-y-2">
        <PasswordField
          id="signin-password"
          data-testid="signin-password-input"
          label="Senha"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgot}
            data-testid="signin-forgot-password-link"
            className="text-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            Esqueci minha senha
          </button>
        </div>
      </div>

      <SubmitButton busy={busy} testId="signin-submit-button">
        {busy ? "Entrando..." : "Entrar"}
      </SubmitButton>
    </form>
  );
}

export default SignInForm;
