"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { StoredUser, User } from "@/lib/types";
import { useStoredState } from "@/lib/useStoredState";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  /** Customer sign-in. Resolves to an error message, or null on success. */
  signIn: (email: string, password: string) => Promise<string | null>;
  /** Customer sign-up. Resolves to an error message, or null on success. */
  signUp: (u: Omit<StoredUser, "createdAt">) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const NO_USERS: StoredUser[] = [];

const toUser = (email: string, first: string, last: string): User => ({
  name: `${first} ${last}`.trim() || email, email, initials: ((first[0] ?? "") + (last[0] ?? "")).toUpperCase() || email[0].toUpperCase(),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Browser-storage mode (no Supabase keys)
  const [localUser, setLocalUser] = useStoredState<User | null>("wb_user", null);
  const [localUsers, setLocalUsers] = useStoredState("wb_users", NO_USERS);
  // Supabase mode
  const [sbUser, setSbUser] = useState<User | null>(null);

  useEffect(() => {
    if (!supabase) return;
    const apply = (u: { email?: string; user_metadata?: Record<string, string> } | null | undefined) =>
      setSbUser(u?.email ? toUser(u.email, u.user_metadata?.first_name ?? "", u.user_metadata?.last_name ?? "") : null);
    supabase.auth.getSession().then(({ data }) => apply(data.session?.user));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => apply(session?.user));
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const e = email.trim().toLowerCase();
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email: e, password });
      return error ? "Invalid email or password." : null;
    }
    const found = localUsers.find(u => u.email === e && u.password === password);
    if (!found) return "Invalid email or password.";
    setLocalUser(toUser(found.email, found.firstName, found.lastName));
    return null;
  };

  const signUp = async (u: Omit<StoredUser, "createdAt">) => {
    const email = u.email.trim().toLowerCase();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password: u.password, options: { data: { first_name: u.firstName, last_name: u.lastName } } });
      if (error) return error.message;
      // With "Confirm email" on, Supabase returns a user with no identities for an already-registered address
      if (data.user && !data.user.identities?.length) return "An account with this email already exists.";
      // Sign-up shouldn't silently sign the customer in; they log in on the next screen
      if (data.session) await supabase.auth.signOut();
      return null;
    }
    if (localUsers.some(x => x.email === email)) return "An account with this email already exists.";
    setLocalUsers(list => [...list, { ...u, email, createdAt: new Date().toISOString() }]);
    return null;
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    else setLocalUser(null);
  };

  return (
    <AuthContext.Provider value={{ user: supabase ? sbUser : localUser, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
