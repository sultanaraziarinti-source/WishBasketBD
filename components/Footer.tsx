"use client";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";

export default function Footer() {
  const { categories, settings } = useShop();

  return (
    <footer className="bg-brand-dk text-cream/80 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <span className="w-[76px] h-[76px] rounded-full bg-white flex items-center justify-center shrink-0 shadow"><Image src="/logo.png" alt="Wish Basket BD" width={66} height={66} /></span>
            <span className="leading-none">
              <span className="block font-script text-3xl text-cream">Wish</span>
              <span className="block text-[11px] font-bold tracking-[0.3em] text-gold">BASKET BD</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs">Bringing happiness to your home — handpicked products with quality you love and prices you adore.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gold mb-3">Quick Links</h4>
          <ul className="space-y-2">
            {[["Home", "/"], ["All Products", "/shop"], ["Wishlist", "/wishlist"], ["About Us", "/about"], ["Contact Us", "/contact"]].map(([l, h]) => (
              <li key={l}><Link href={h} className="hover:text-gold transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gold mb-3">Top Categories</h4>
          <ul className="space-y-2">
            {categories.map(c => (
              <li key={c.key}><Link href={`/category/${c.key}`} className="hover:text-gold transition-colors">{c.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h4 className="font-semibold text-gold mb-3">Contact Us</h4>
          <ul className="space-y-2">
            <li>📍 {settings.address}</li>
            <li>📞 {settings.hotline}</li>
            <li>✉️ {settings.email}</li>
            <li>🚚 Delivery all over Bangladesh</li>
            <li>💵 Cash on Delivery & bKash</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 px-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} Wish Basket BD. All rights reserved.
        <span className="mx-2">·</span>
        <Link href="/admin/login" className="hover:text-gold underline-offset-2 hover:underline">🛡️ Admin Login</Link>
      </div>
    </footer>
  );
}
