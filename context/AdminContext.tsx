"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { DEFAULT_ADMIN } from "@/lib/admin";
import { useStoredState } from "@/lib/useStoredState";
import { supabaseEnabled } from "@/lib/supabase";
import * as api from "@/lib/db";

interface AdminContextType {
  admin: string | null;
  /** Resolves to an error message, or null when email + password are correct for an admin account. */
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  /** Resolves to an error message, or null on success. */
  changePassword: (current: string, next: string) => Promise<string | null>;
}

const AdminContext = createContext<AdminContextType>({} as AdminContextType);

// Remove sessions saved by older versions, which kept admins signed in across visits
const OLD_SESSION_KEYS = ["wb_admin_session", "wb_admin_session_v2"];

export function AdminProvider({ children }: { children: ReactNode }) {
  // Browser-storage mode only: the admin login lives in this browser (Supabase mode uses Supabase Auth)
  const [creds, setCreds] = useStoredState("wb_admin_creds_v2", DEFAULT_ADMIN);
  // Session lives only in memory: every page reload, new tab or browser restart asks for email + password again
  const [session, setSession] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    try { OLD_SESSION_KEYS.forEach(k => localStorage.removeItem(k)); } catch {}
  }, []);

  // Local mode: session only counts while it still matches the saved credentials
  const admin = !session ? null
    : supabaseEnabled ? session.email
    : session.email === creds.email && session.password === creds.password ? session.email : null;

  const login = async (email: string, password: string) => {
    const e = email.trim().toLowerCase();
    if (!e || !password) return "Please enter both email and password.";
    const err = supabaseEnabled
      ? await api.adminSignIn(e, password).catch(() => "Couldn't reach the server. Check your internet connection.")
      : creds.password && e === creds.email && password === creds.password ? null : "Invalid admin email or password.";
    setSession(err ? null : { email: e, password });
    return err;
  };

  const logout = () => {
    setSession(null);
    if (supabaseEnabled) api.adminSignOut().catch(() => {});
  };

  const changePassword = async (current: string, next: string) => {
    if (next.length < 8) return "New password must be at least 8 characters.";
    if (supabaseEnabled) {
      if (!session) return "Please sign in again.";
      const err = await api.adminChangePassword(session.email, current, next);
      if (!err) setSession({ ...session, password: next });
      return err;
    }
    if (current !== creds.password) return "Current password is incorrect.";
    setCreds({ ...creds, password: next });
    setSession(s => s && { ...s, password: next });
    return null;
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, changePassword }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
