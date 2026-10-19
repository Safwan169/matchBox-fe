"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";
import type { ApiItem, User } from "@/lib/types";

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string; // YYYY-MM-DD
  password: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login(email: string, password: string): Promise<User>;
  register(input: RegisterInput): Promise<User>;
  logout(): Promise<void>;
  setUser(user: User): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // /auth/session returns 200 with null when signed out (no console error for visitors).
    api<ApiItem<User | null>>("/auth/session")
      .then((r) => setUser(r.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api<ApiItem<User>>("/auth/login", { method: "POST", body: { email, password } });
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const { data } = await api<ApiItem<User>>("/auth/register", { method: "POST", body: input });
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setUser }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/** Redirects to /login (and back afterwards) when there is no signed-in user. */
export function useRequireAuth({ admin = false } = {}) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const allowed = !!auth.user && (!admin || auth.user.role === "admin");

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (admin && auth.user.role !== "admin") router.replace("/");
  }, [auth.loading, auth.user, admin, pathname, router]);

  return { ...auth, allowed };
}
