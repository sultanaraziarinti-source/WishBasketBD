"use client";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import { StatusPill } from "@/components/OrderDetails";
import PageBanner from "@/components/PageBanner";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { formatDate, formatTk } from "@/lib/products";
import { useHydrated } from "@/lib/useStoredState";

export default function OrdersPage() {
  const { orders, myOrderIds } = useShop();
  const { user } = useAuth();
  const hydrated = useHydrated();

  // Orders placed from this browser, plus any placed while signed in with this account
  const mine = orders.filter(o => myOrderIds.includes(o.id) || (user && o.userEmail === user.email));

  return (
    <div className="max-w-4xl mx-auto px-4">
      <PageBanner crumbs={[["My Orders"]]} title="My Orders" subtitle="Your recent orders and their delivery status." tone="gold" />

      <h2 className="mt-8 mb-4 text-xl font-bold text-brand">Recent orders</h2>
      {!hydrated ? null : mine.length === 0 ? (
        <EmptyState icon="📦" title="No orders yet" text="When you place an order it will show up here." />
      ) : (
        <ul className="space-y-3">
          {mine.map(o => (
            <li key={o.id}>
              <Link href={`/order/${o.id}`} className="flex flex-wrap items-center gap-3 justify-between p-4 bg-white rounded-2xl border border-sage hover:border-brand transition-colors">
                <span>
                  <span className="block font-semibold text-brand">#{o.id}</span>
                  <span className="text-xs text-brand/60">{formatDate(o.createdAt)} · {o.items.reduce((s, i) => s + i.qty, 0)} items</span>
                </span>
                <span className="flex items-center gap-3"><StatusPill status={o.status} /><b className="text-brand">{formatTk(o.total)}</b></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
