"use client";
import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import Toast from "@/components/Toast";

type ToastType = "success" | "error";

const ToastContext = createContext<(msg: string, type?: ToastType) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; msg: string; type: ToastType } | null>(null);

  const show = useCallback((msg: string, type: ToastType = "success") => setToast({ id: Date.now(), msg, type }), []);
  const done = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && <Toast key={toast.id} message={toast.msg} type={toast.type} onDone={done} />}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
