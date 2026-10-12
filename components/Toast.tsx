"use client";
import { useEffect, useState } from "react";

interface ToastProps { message: string; type?: "success" | "error"; onDone: () => void; }

export default function Toast({ message, type = "success", onDone }: ToastProps) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300); }, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-80 z-[9999] transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium toast-animate ${type === "success" ? "bg-brand text-cream" : "bg-heart text-white"}`}>
        <span className={type === "success" ? "text-gold" : ""}>{type === "success" ? "✔" : "✖"}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
