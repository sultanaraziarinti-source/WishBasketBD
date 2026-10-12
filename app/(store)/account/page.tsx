"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import PageBanner from "@/components/PageBanner";
import { StatusPill } from "@/components/OrderDetails";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatDate, formatTk } from "@/lib/products";
import { useHydrated } from "@/lib/useStoredState";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { orders, myOrderIds } = useShop();
  const { ids } = useWishlist();
  const router = useRouter();
  const hydrated = useHydrated();

  if (!hydrated) return null;
  if (!user) return <div className="max-w-7xl mx-auto px-4"><EmptyState icon="👤" title="You're not signed in" text="Sign in to see your account and orders." href="/login" cta="Sign In" /></div>;

  const mine = orders.filter(o => o.userEmail === user.email || myOrderIds.includes(o.id));
  const spent = mine.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <div className="max-w-5xl mx-auto px-4">
      <PageBanner crumbs={[["My Account"]]} script="Welcome back" title={user.name} subtitle={user.email} />

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[["Orders", mine.length, "/orders"], ["Wishlist", ids.length, "/wishlist"], ["Total spent", formatTk(spent), "/orders"]].map(([l, v, h]) => (
          <Link key={l} href={h as string} className="p-4 md:p-5 rounded-2xl bg-white border border-sage hover:border-brand transition-colors">
            <span className="block text-xs text-brand/60">{l}</span>
            <span className="text-xl md:text-2xl font-bold text-brand">{v}</span>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-xl font-bold text-brand">Recent orders</h2>
      {mine.length === 0 ? <p className="text-sm text-brand/60">No orders yet — <Link href="/shop" className="underline">start shopping</Link>.</p> : (
        <ul className="space-y-3">
          {mine.slice(0, 5).map(o => (
            <li key={o.id}>
              <Link href={`/order/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-sage hover:border-brand transition-colors">
                <span><b className="text-brand">#{o.id}</b><span className="block text-xs text-brand/60">{formatDate(o.createdAt)}</span></span>
                <span className="flex items-center gap-3"><StatusPill status={o.status} /><b>{formatTk(o.total)}</b></span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => { logout(); router.push("/"); }} className="mt-10 px-6 py-3 rounded-full border-2 border-sage text-brand font-semibold hover:bg-sage cursor-pointer">Sign Out</button>
    </div>
  );
}
