"use client";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { StatusPill } from "@/components/OrderDetails";
import SalesChart, { Day } from "@/components/admin/SalesChart";
import { PageHead, StatTile, card } from "@/components/admin/ui";
import { useShop } from "@/context/ShopContext";
import { formatDate, formatTk } from "@/lib/products";

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

export default function DashboardPage() {
  const { orders, products, users } = useShop();
  const live = orders.filter(o => o.status !== "cancelled");
  const revenue = live.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === "pending").length;
  const today = dayKey(new Date());
  const todayOrders = live.filter(o => dayKey(new Date(o.createdAt)) === today);
  const lowStock = products.filter(p => p.stock <= 5).sort((a, b) => a.stock - b.stock);

  const days: Day[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const k = dayKey(d);
    const dayOrders = live.filter(o => dayKey(new Date(o.createdAt)) === k);
    return {
      label: d.toLocaleDateString("en-GB", { weekday: "short" }),
      date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    };
  });

  // Best sellers by units sold (non-cancelled orders)
  const sold = new Map<number, { name: string; qty: number; revenue: number }>();
  live.forEach(o => o.items.forEach(i => {
    const cur = sold.get(i.id) ?? { name: i.name, qty: 0, revenue: 0 };
    sold.set(i.id, { name: i.name, qty: cur.qty + i.qty, revenue: cur.revenue + i.qty * i.price });
  }));
  const best = [...sold.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);

  return (
    <>
      <PageHead title="Dashboard" sub="Overview of your store" action={<Link href="/admin/products/new" className="inline-flex items-center h-10 px-5 rounded-full bg-gold hover:bg-gold-dk text-brand-dk text-sm font-semibold">+ Add Product</Link>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatTile tone="brand" label="Total revenue" value={formatTk(revenue)} hint={`${live.length} orders (excl. cancelled)`} />
        <StatTile label="Today" value={formatTk(todayOrders.reduce((s, o) => s + o.total, 0))} hint={`${todayOrders.length} order${todayOrders.length === 1 ? "" : "s"} today`} />
        <StatTile tone={pending ? "warn" : "plain"} label="Pending orders" value={pending} hint={<Link href="/admin/orders?status=pending" className="underline">Review now →</Link>} />
        <StatTile label="Products / Customers" value={`${products.length} / ${users.length}`} hint={`${lowStock.length} low on stock`} />
      </div>

      <div className="mt-6 grid lg:grid-cols-[1.6fr_1fr] gap-4 md:gap-6">
        <section className={`${card} p-5`}><SalesChart days={days} /></section>

        <section className={`${card} p-5`}>
          <h3 className="font-semibold text-brand mb-3">Best sellers</h3>
          {best.length === 0 ? <p className="text-sm text-brand/50">No sales yet.</p> : (
            <ol className="space-y-2.5">
              {best.map((b, i) => (
                <li key={b.name} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-sage text-brand text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="flex-1 truncate">{b.name}</span>
                  <span className="text-brand/60 tabular-nums">{b.qty} sold</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <div className="mt-6 grid lg:grid-cols-[1.6fr_1fr] gap-4 md:gap-6">
        <section className={`${card} p-5`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-brand">Recent orders</h3>
            <Link href="/admin/orders" className="text-xs font-semibold text-brand/70 underline">View all</Link>
          </div>
          {orders.length === 0 ? <p className="text-sm text-brand/50">No orders yet. They&apos;ll appear here as customers check out.</p> : (
            <ul className="divide-y divide-sage">
              {orders.slice(0, 6).map(o => (
                <li key={o.id}>
                  <Link href={`/admin/orders?open=${o.id}`} className="py-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm hover:bg-cream -mx-2 px-2 rounded-lg">
                    <b className="text-brand">#{o.id}</b>
                    <span className="text-brand/60 truncate">{o.customer.name}</span>
                    <span className="ml-auto flex items-center gap-3"><StatusPill status={o.status} /><b className="tabular-nums">{formatTk(o.total)}</b></span>
                    <span className="w-full text-xs text-brand/40">{formatDate(o.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${card} p-5`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-brand">⚠️ Low stock</h3>
            <Link href="/admin/products?stock=low" className="text-xs font-semibold text-brand/70 underline">Manage</Link>
          </div>
          {lowStock.length === 0 ? <p className="text-sm text-brand/50">All products are well stocked.</p> : (
            <ul className="space-y-2">
              {lowStock.slice(0, 8).map(p => (
                <li key={p.id}>
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 text-sm hover:bg-cream -mx-2 px-2 py-1 rounded-lg">
                    <span className="w-9 h-9 rounded-lg bg-sage flex items-center justify-center overflow-hidden shrink-0"><ProductImage product={p} className="text-lg" /></span>
                    <span className="flex-1 truncate">{p.name}</span>
                    <span className={`text-xs font-bold ${p.stock === 0 ? "text-heart" : "text-gold-dk"}`}>{p.stock === 0 ? "Out" : `${p.stock} left`}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
