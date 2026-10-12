"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { CloseIcon } from "./Icons";

interface Props { open: boolean; onClose: () => void; }

export default function MobileDrawer({ open, onClose }: Props) {
  const { user, logout } = useAuth();
  const { categories } = useShop();

  const link = (href: string, label: string) => (
    <li key={href}><Link href={href} onClick={onClose} className="flex items-center gap-3 px-5 py-3 text-brand hover:bg-sage">{label}</Link></li>
  );

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden fade-in" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-cream z-50 flex flex-col shadow-2xl transition-transform duration-300 md:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 bg-brand">
          <span className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={40} height={40} />
            <span className="font-script text-2xl text-cream">Wish <span className="text-gold font-sans text-sm font-bold tracking-widest">BASKET BD</span></span>
          </span>
          <button onClick={onClose} className="text-cream cursor-pointer" aria-label="Close menu"><CloseIcon /></button>
        </div>
        <ul className="flex-1 overflow-y-auto py-3">
          {link("/", "🏡 Home")}
          {link("/shop", "🛍️ All Products")}
          <li className="px-5 pt-4 pb-1 text-xs font-bold tracking-widest text-sage-dk">CATEGORIES</li>
          {categories.map(c => link(`/category/${c.key}`, `${c.icon} ${c.label}`))}
          <li className="px-5 pt-4 pb-1 text-xs font-bold tracking-widest text-sage-dk">MORE</li>
          {link("/orders", "📦 My Orders")}
          {link("/about", "💚 About Us")}
          {link("/contact", "📞 Contact Us")}
        </ul>
        <div className="px-5 py-4 border-t border-sage">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-brand text-gold text-sm font-bold flex items-center justify-center">{user.initials}</span>
              <div className="flex-1 min-w-0">
                <Link href="/account" onClick={onClose} className="block font-semibold text-sm truncate">{user.name}</Link>
                <button onClick={() => { logout(); onClose(); }} className="text-xs text-brand/70 cursor-pointer">Sign out</button>
              </div>
            </div>
          ) : (
            <Link href="/login" onClick={onClose} className="block py-2.5 text-center rounded-full bg-gold text-brand-dk text-sm font-semibold">Login / Sign up</Link>
          )}
        </div>
      </aside>
    </>
  );
}
