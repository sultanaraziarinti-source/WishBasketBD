"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { useShop } from "@/context/ShopContext";
import { CloseIcon, MenuIcon } from "@/components/Icons";
import { useHydrated } from "@/lib/useStoredState";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { admin, logout } = useAdmin();
  const { orders, products, messages } = useShop();
  const hydrated = useHydrated();
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { if (hydrated && !admin) router.replace("/admin/login"); }, [hydrated, admin, router]);
  if (!hydrated || !admin) return <div className="min-h-screen bg-cream" />;

  const pending = orders.filter(o => o.status === "pending").length;
  const lowStock = products.filter(p => p.stock <= 5).length;
  const unread = messages.filter(m => !m.read).length;

  const NAV: [string, string, string, number?][] = [
    ["/admin/manage", "🗂️", "Manage Store"],
    ["/admin", "📊", "Dashboard"],
    ["/admin/orders", "📦", "Orders", pending],
    ["/admin/products", "🛍️", "Products", lowStock],
    ["/admin/categories", "🗂️", "Categories"],
    ["/admin/customers", "👥", "Customers"],
    ["/admin/messages", "✉️", "Messages", unread],
    ["/admin/settings", "⚙️", "Settings"],
  ];

  const isOn = (href: string) => href === "/admin" ? path === "/admin" : path.startsWith(href);

  const sidebar = (
    <nav className="flex flex-col h-full">
      <Link href="/" target="_blank" rel="noopener" title="Open store home page in a new tab" className="flex items-center gap-3 px-5 py-5 border-b border-white/10 hover:bg-white/5">
        <span className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 shadow"><Image src="/logo.png" alt="" width={48} height={48} /></span>
        <span className="leading-none">
          <span className="block font-script text-2xl text-cream">Wish Basket</span>
          <span className="block text-[10px] font-bold tracking-[0.25em] text-gold">ADMIN PANEL</span>
        </span>
      </Link>
      <ul className="flex-1 py-4 px-3 space-y-1">
        {NAV.map(([href, icon, label, count]) => (
          <li key={href}>
            <Link href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${isOn(href) ? "bg-gold text-brand-dk font-semibold" : "text-cream/80 hover:bg-white/10"}`}>
              <span>{icon}</span>{label}
              {!!count && <span className={`ml-auto min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center ${isOn(href) ? "bg-brand text-gold" : "bg-heart text-white"}`}>{count}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link href="/" target="_blank" className="block text-center py-2 rounded-xl bg-white/10 text-cream text-sm hover:bg-white/20">View Store ↗</Link>
        <button onClick={() => { logout(); router.replace("/admin/login"); }} className="w-full py-2 rounded-xl text-sm text-cream/70 hover:text-gold cursor-pointer">Sign out</button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-cream md:pl-64">
      <aside className="hidden md:block fixed inset-y-0 left-0 w-64 bg-brand-dk">{sidebar}</aside>

      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden fade-in" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-brand-dk z-50 transition-transform md:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setOpen(false)} className="absolute top-5 right-4 text-cream cursor-pointer" aria-label="Close menu"><CloseIcon /></button>
        {sidebar}
      </aside>

      <header className="sticky top-0 z-30 h-16 bg-cream/95 backdrop-blur border-b border-sage flex items-center gap-3 px-4 md:px-8">
        <button onClick={() => setOpen(true)} className="md:hidden text-brand cursor-pointer" aria-label="Open menu"><MenuIcon /></button>
        <h1 className="font-semibold text-brand">{NAV.find(([h]) => isOn(h))?.[2] ?? "Admin"}</h1>
        <span className="ml-auto flex items-center gap-2 text-sm text-brand/70">
          <span className="hidden sm:inline">{admin}</span>
          <span className="w-9 h-9 rounded-full bg-brand text-gold font-bold flex items-center justify-center">A</span>
        </span>
      </header>

      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
