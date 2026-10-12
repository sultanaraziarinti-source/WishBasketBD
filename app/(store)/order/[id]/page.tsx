"use client";
import { use } from "react";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import OrderDetails from "@/components/OrderDetails";
import { useShop } from "@/context/ShopContext";
import { useHydrated } from "@/lib/useStoredState";

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { orders, settings } = useShop();
  const hydrated = useHydrated();
  const order = orders.find(o => o.id === id);

  if (!hydrated) return null;
  if (!order) return <div className="max-w-7xl mx-auto px-4"><EmptyState icon="📦" title="Order not found" text="It may have been placed from another device." href="/orders" cta="My Orders" /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="mt-8 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-sage flex items-center justify-center text-4xl">🎉</div>
        <span className="mt-3 block font-script text-3xl text-gold-dk">Thank you!</span>
        <h1 className="text-2xl md:text-3xl font-bold text-brand">Your order has been placed</h1>
        <p className="mt-1 text-sm text-brand/70">We&apos;ll call you on {order.customer.phone} to confirm. Questions? Hotline {settings.hotline}</p>
      </div>
      <div className="mt-6 bg-white rounded-3xl border border-sage p-5 md:p-6">
        <OrderDetails order={order} />
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="px-6 py-3 rounded-full bg-brand text-cream text-sm font-semibold">Continue Shopping</Link>
        <Link href="/orders" className="px-6 py-3 rounded-full border-2 border-brand text-brand text-sm font-semibold">My Orders</Link>
      </div>
    </div>
  );
}
