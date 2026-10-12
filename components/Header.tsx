"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useShop } from "@/context/ShopContext";
import { useWishlist } from "@/context/WishlistContext";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon } from "./Icons";
import MobileDrawer from "./MobileDrawer";

// Categories shown directly in the menu bar; the rest go under "More"
const VISIBLE = 5;

const LoginIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="m10 17 5-5-5-5" /><path d="M15 12H3" />
  </svg>
);

const Caret = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 opacity-80"><path d="m6 9 6 6 6-6" /></svg>
);

export default function Header() {
  const { user } = useAuth();
  const { cartCount, openCart } = useCart();
  const { categories } = useShop();
  const { ids } = useWishlist();
  const router = useRouter();
  const path = usePathname();
  const [q, setQ] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop");
  };

  const shown = categories.slice(0, VISIBLE);
  const more = categories.slice(VISIBLE);
  const navCls = (on: boolean) => `flex items-center gap-1 h-16 px-1 font-semibold text-[15px] whitespace-nowrap border-b-[3px] ${on ? "border-gold text-gold" : "border-transparent text-white hover:text-gold"}`;

  const count = (n: number) => (
    <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">{n}</span>
  );

  return (
    <>
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[72px] md:h-[90px] flex items-center gap-4 md:gap-10">
          <button onClick={() => setDrawerOpen(true)} className="md:hidden text-brand cursor-pointer" aria-label="Open menu"><MenuIcon /></button>

          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.png" alt="Wish Basket BD" width={64} height={64} className="w-12 h-12 md:w-16 md:h-16" preload />
            <span className="leading-none">
              <span className="block font-script text-2xl md:text-3xl text-brand">Wish</span>
              <span className="block text-[10px] md:text-[11px] font-bold tracking-[0.3em] text-gold-dk">BASKET BD</span>
            </span>
          </Link>

          <form onSubmit={submit} className="hidden md:flex flex-1 max-w-3xl mx-auto relative">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search for products..."
              className="w-full h-[52px] pl-6 pr-14 rounded-full border border-gray-300 bg-white text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-brand" />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" aria-label="Search"><SearchIcon className="w-6 h-6" /></button>
          </form>

          <div className="ml-auto md:ml-0 flex items-center gap-5 md:gap-7 text-brand-dk">
            <Link href="/wishlist" className="relative" aria-label="Wishlist">
              <HeartIcon className="w-7 h-7" />{ids.length > 0 && count(ids.length)}
            </Link>
            <button onClick={openCart} className="relative cursor-pointer" aria-label="Cart">
              <BagIcon className="w-7 h-7" />{count(cartCount)}
            </button>
            {user ? (
              <Link href="/account" className="hidden md:flex items-center gap-2 font-semibold text-[17px]">
                <span className="w-8 h-8 rounded-full bg-brand text-gold text-xs font-bold flex items-center justify-center">{user.initials}</span>
                {user.name.split(" ")[0]}
              </Link>
            ) : (
              <Link href="/login" className="hidden md:flex items-center gap-2 font-semibold text-[17px] hover:text-brand"><LoginIcon className="w-6 h-6" />Login</Link>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={submit} className="md:hidden px-4 pb-3 relative">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search for products..."
            className="w-full h-11 pl-5 pr-12 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-brand" />
          <button className="absolute right-8 top-1/2 -translate-y-[calc(50%+6px)] text-gray-500" aria-label="Search"><SearchIcon /></button>
        </form>

        {/* Category menu bar */}
        <nav className="hidden md:block bg-brand">
          <ul className="max-w-[1400px] mx-auto px-8 flex items-center justify-center gap-10">
            <li><Link href="/shop" className={navCls(path === "/shop")}>All Products</Link></li>
            {shown.map(c => (
              <li key={c.key}><Link href={`/category/${c.key}`} className={navCls(path === `/category/${c.key}`)}>{c.label}</Link></li>
            ))}
            <li className="relative group">
              <button className={`${navCls(false)} cursor-pointer`}>More <Caret /></button>
              <ul className="absolute right-0 top-full min-w-56 py-2 bg-white rounded-b-xl shadow-xl border border-sage hidden group-hover:block group-focus-within:block">
                {more.map(c => (
                  <li key={c.key}><Link href={`/category/${c.key}`} className="block px-5 py-2.5 text-sm text-brand-dk hover:bg-sage">{c.icon} {c.label}</Link></li>
                ))}
                {more.length > 0 && <li className="my-1 border-t border-sage" />}
                {[["/categories", "All Categories"], ["/about", "About Us"], ["/contact", "Contact Us"]].map(([h, l]) => (
                  <li key={h}><Link href={h} className="block px-5 py-2.5 text-sm text-brand-dk hover:bg-sage">{l}</Link></li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
