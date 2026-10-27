import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

const pool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
});

export interface Claims {
  sub: string;
  email?: string;
  name?: string;
  phone_number?: string;
  email_verified?: boolean;
  "cognito:groups"?: string[];
  [key: string]: unknown;
}

export interface AuthUser {
  access_token: string;
  id_token: string;
  profile: Claims;
}

function toUser(session: CognitoUserSession): AuthUser {
  const id = session.getIdToken();
  return {
    access_token: session.getAccessToken().getJwtToken(),
    id_token: id.getJwtToken(),
    profile: id.decodePayload() as Claims,
  };
}

const cognitoUser = (email: string) =>
  new CognitoUser({ Username: email.trim().toLowerCase(), Pool: pool });

export function signIn(email: string, password: string): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    const user = cognitoUser(email);
    const details = new AuthenticationDetails({ Username: user.getUsername(), Password: password });
    user.authenticateUser(details, {
      onSuccess: (session) => resolve(toUser(session)),
      onFailure: reject,
      newPasswordRequired: () =>
        reject(Object.assign(new Error("new password required"), { code: "NewPasswordRequired" })),
      mfaRequired: () => reject(Object.assign(new Error("mfa required"), { code: "MfaRequired" })),
      totpRequired: () => reject(Object.assign(new Error("mfa required"), { code: "MfaRequired" })),
    });
  });
}

/** Restores the cached session, refreshing tokens with the refresh token when expired. */
export function getCurrentUser(): Promise<AuthUser | null> {
  return new Promise((resolve) => {
    const user = pool.getCurrentUser();
    if (!user) return resolve(null);
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      resolve(err || !session?.isValid() ? null : toUser(session));
    });
  });
}

export function forgotPassword(email: string): Promise<void> {
  return new Promise((resolve, reject) =>
    cognitoUser(email).forgotPassword({ onSuccess: () => resolve(), onFailure: reject }),
  );
}

export function confirmForgotPassword(email: string, code: string, newPassword: string): Promise<void> {
  return new Promise((resolve, reject) =>
    cognitoUser(email).confirmPassword(code.trim(), newPassword, {
      onSuccess: () => resolve(),
      onFailure: reject,
    }),
  );
}

export function signOut(): void {
  pool.getCurrentUser()?.signOut();
}

const MESSAGES: Record<string, string> = {
  NotAuthorizedException: "E-mail ou senha incorretos.",
  UserNotFoundException: "E-mail ou senha incorretos.",
  UserNotConfirmedException: "Sua conta ainda não foi confirmada. Fale com o administrador.",
  PasswordResetRequiredException: "É necessário redefinir sua senha. Use “Esqueci minha senha”.",
  CodeMismatchException: "Código inválido. Verifique o e-mail e tente novamente.",
  ExpiredCodeException: "Código expirado. Solicite um novo código.",
  InvalidPasswordException: "A nova senha não atende aos requisitos de segurança.",
  LimitExceededException: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  TooManyRequestsException: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  NewPasswordRequired: "Sua conta exige a definição de uma nova senha. Fale com o administrador.",
  MfaRequired: "Sua conta exige verificação em duas etapas, ainda não suportada nesta tela.",
};

export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string; name?: string })?.code ?? (error as { name?: string })?.name;
  return (code && MESSAGES[code]) || "Não foi possível concluir a operação. Tente novamente.";
}
