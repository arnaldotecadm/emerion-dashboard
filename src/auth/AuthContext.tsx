import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import * as cognito from "./cognito";

interface AuthContextValue {
  user: cognito.AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const REFRESH_INTERVAL_MS = 4 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<cognito.AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cognito.getCurrentUser().then(setUser).finally(() => setIsLoading(false));
  }, []);

  // Keeps the access token fresh; the SDK uses the refresh token once it expires.
  useEffect(() => {
    if (!user) return;
    const id = window.setInterval(() => cognito.getCurrentUser().then(setUser), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    setUser(await cognito.signIn(email, password));
  }, []);

  const signOut = useCallback(() => {
    cognito.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
