/** Base URL (including the `/api/v1` context path) for the ERP backend REST API. */
export const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/api/v1`;

/**
 * Holds the current Cognito-issued JWT access token, set by `App.tsx` whenever
 * `react-oidc-context`'s auth state changes. Kept outside React state since
 * plain service functions (not hooks/components) need synchronous access to it.
 */
let authToken: string | null = null;

/** Updates the JWT sent with every subsequent API request. Pass `null` on sign-out. */
export function setAuthToken(token: string | null): void {
  authToken = token;
}

/**
 * Thin wrapper around `fetch` that automatically attaches the current JWT as a
 * `Bearer` token, so the ERP backend can validate the caller's identity.
 */
export function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  return fetch(input, { ...init, headers });
}
