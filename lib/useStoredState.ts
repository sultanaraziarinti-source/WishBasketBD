"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";

// localStorage-backed state that is SSR-safe (server snapshot is the fallback)
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => { listeners.delete(cb); window.removeEventListener("storage", cb); };
};

const read = (key: string) => {
  try { return localStorage.getItem(key); } catch { return null; }
};

export function useStoredState<T>(key: string, fallback: T) {
  const raw = useSyncExternalStore(subscribe, () => read(key), () => null);
  const value = useMemo<T>(() => (raw ? JSON.parse(raw) : fallback), [raw, fallback]);

  // Returns false when the browser refuses the write (e.g. storage quota full)
  const set = useCallback((next: T | ((cur: T) => T)) => {
    const cur = read(key);
    const resolved = typeof next === "function" ? (next as (c: T) => T)(cur ? JSON.parse(cur) : fallback) : next;
    let ok = true;
    try {
      if (resolved === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(resolved));
    } catch { ok = false; }
    listeners.forEach(l => l());
    return ok;
  }, [key, fallback]);

  return [value, set] as const;
}

const noop = () => () => {};

// False during SSR and hydration, true once running in the browser
export const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);
