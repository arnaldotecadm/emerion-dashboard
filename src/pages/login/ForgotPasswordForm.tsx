import { useState, type FormEvent } from "react";
import { authErrorMessage, confirmForgotPassword, forgotPassword } from "../../auth/cognito";
import { Field, FormMessage, PasswordField, SubmitButton } from "./fields";

interface ForgotPasswordFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  onBack: () => void;
  onDone: () => void;
}

function ForgotPasswordForm({ email, onEmailChange, onBack, onDone }: ForgotPasswordFormProps) {
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!codeSent) return run(async () => { await forgotPassword(email); setCodeSent(true); });
    if (password !== confirm) return setError("As senhas não coincidem.");
    return run(async () => { await confirmForgotPassword(email, code, password); onDone(); });
  };

  return (
    <form onSubmit={submit} className="space-y-6" data-testid="forgot-password-form">
      <div>
        <h1 className="text-3xl font-semibold text-fg-strong">Redefinir senha</h1>
        <p className="mt-2 text-sm text-fg-muted">
          {codeSent
            ? "Se o e-mail estiver cadastrado, você receberá um código. Informe-o abaixo com a nova senha."
            : "Informe seu e-mail e enviaremos um código de verificação."}
        </p>
      </div>

      {error && <FormMessage kind="error" testId="forgot-error">{error}</FormMessage>}

      <Field
        id="forgot-email"
        data-testid="forgot-email-input"
        label="E-mail"
        icon="mail"
        type="email"
        autoComplete="username"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        disabled={codeSent}
        required
        autoFocus
      />

      {codeSent && (
        <>
          <Field
            id="forgot-code"
            data-testid="forgot-code-input"
            label="Código de verificação"
            icon="pin"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <PasswordField
            id="forgot-new-password"
            data-testid="forgot-new-password-input"
            label="Nova senha"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordField
            id="forgot-confirm-password"
            data-testid="forgot-confirm-password-input"
            label="Confirmar nova senha"
            autoComplete="new-password"
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </>
      )}

      <SubmitButton busy={busy} testId="forgot-submit-button">
        {codeSent ? "Alterar senha" : "Enviar código"}
      </SubmitButton>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          data-testid="forgot-back-to-signin-link"
          className="flex items-center gap-1 font-medium text-fg-muted transition-colors hover:text-accent"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Voltar para o login
        </button>
        {codeSent && (
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => forgotPassword(email))}
            data-testid="forgot-resend-code-button"
            className="font-medium text-accent transition-opacity hover:opacity-80"
          >
            Reenviar código
          </button>
        )}
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
