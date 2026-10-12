"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { BagIcon, GridIcon, HeartIcon, HomeIcon, UserIcon } from "./Icons";

export default function MobileBottomNav() {
  const path = usePathname();
  const { cartCount, openCart } = useCart();
  const { ids } = useWishlist();
  const { user } = useAuth();

  const item = (href: string, label: string, icon: React.ReactNode, count = 0) => (
    <li className="flex-1">
      <Link href={href} className={`relative h-full flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${path === href ? "text-brand" : "text-brand/50"}`}>
        {icon}{label}
        {count > 0 && <span className="absolute top-1.5 left-1/2 ml-1.5 min-w-4 h-4 px-1 rounded-full bg-heart text-white text-[9px] font-bold flex items-center justify-center">{count}</span>}
      </Link>
    </li>
  );

  return (
    <>
      <div className="h-16 md:hidden" />
      <nav className="fixed bottom-0 inset-x-0 z-30 h-16 bg-white border-t border-sage shadow-[0_-4px_20px_rgba(30,77,58,0.08)] md:hidden">
        <ul className="flex h-full">
          {item("/", "Home", <HomeIcon />)}
          {item("/shop", "Shop", <GridIcon />)}
          <li className="flex-1 flex justify-center">
            <button onClick={openCart} className="relative -mt-6 w-14 h-14 rounded-full bg-brand text-gold border-4 border-cream shadow-lg flex items-center justify-center cursor-pointer" aria-label="Cart">
              <BagIcon className="w-6 h-6" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-gold text-brand-dk text-[10px] font-bold flex items-center justify-center">{cartCount}</span>}
            </button>
          </li>
          {item("/wishlist", "Wishlist", <HeartIcon />, ids.length)}
          {item(user ? "/account" : "/login", user ? "Account" : "Login", <UserIcon />)}
        </ul>
      </nav>
    </>
  );
}
