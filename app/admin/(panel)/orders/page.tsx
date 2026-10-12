"use client";
import { use, useMemo, useState } from "react";
import OrderDetails, { StatusPill } from "@/components/OrderDetails";
import { PageHead, card, field } from "@/components/admin/ui";
import { CloseIcon } from "@/components/Icons";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/context/ToastContext";
import { ORDER_STATUSES, formatDate, formatTk } from "@/lib/products";
import { Order, OrderStatus } from "@/lib/types";

export default function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; open?: string }> }) {
  const sp = use(searchParams);
  const { orders, setOrderStatus } = useShop();
  const toast = useToast();
  const [status, setStatus] = useState<OrderStatus | "all">((sp.status as OrderStatus) ?? "all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(sp.open ?? null);

  const counts = useMemo(() => Object.fromEntries(ORDER_STATUSES.map(s => [s.key, orders.filter(o => o.status === s.key).length])), [orders]);
  const list = orders.filter(o =>
    (status === "all" || o.status === status) &&
    (!q || [o.id, o.customer.name, o.customer.phone].some(v => v.toLowerCase().includes(q.toLowerCase()))));
  const open = orders.find(o => o.id === openId);

  const change = async (o: Order, s: OrderStatus) => {
    if (s === o.status) return;
    if (s === "cancelled" && !window.confirm(`Cancel order #${o.id}? Items will be returned to stock. This can't be undone.`)) return;
    const res = await setOrderStatus(o.id, s);
    toast(res.ok ? `#${o.id} marked ${s}` : `Couldn't update: ${res.error}`, res.ok ? "success" : "error");
  };

  const statusSelect = (o: Order) => (
    <select value={o.status} disabled={o.status === "cancelled"} onChange={e => change(o, e.target.value as OrderStatus)} onClick={e => e.stopPropagation()}
      className="h-9 px-2 rounded-lg border-2 border-sage bg-white text-xs font-semibold focus:outline-none focus:border-brand disabled:opacity-60" aria-label={`Status of #${o.id}`}>
      {ORDER_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
    </select>
  );

  return (
    <>
      <PageHead title="Orders" sub={`${orders.length} orders total`} />

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
        {([["all", "All", orders.length], ...ORDER_STATUSES.map(s => [s.key, s.label, counts[s.key]])] as [string, string, number][]).map(([k, l, n]) => (
          <button key={k} onClick={() => setStatus(k as OrderStatus | "all")}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${status === k ? "bg-brand text-cream" : "bg-white border border-sage text-brand hover:border-brand"}`}>
            {l} <span className="opacity-60">({n})</span>
          </button>
        ))}
      </div>

      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by order ID, name or phone…" className={`${field} mb-4 max-w-md`} />

      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-xs text-brand/60 bg-cream/60">
              <th className="px-4 py-3">Order</th><th className="px-4">Customer</th><th className="px-4">Items</th><th className="px-4 text-right">Total</th><th className="px-4">Payment</th><th className="px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map(o => (
              <tr key={o.id} onClick={() => setOpenId(o.id)} className="border-t border-sage hover:bg-cream/60 cursor-pointer">
                <td className="px-4 py-3"><b className="text-brand">#{o.id}</b><span className="block text-xs text-brand/50">{formatDate(o.createdAt)}</span></td>
                <td className="px-4">{o.customer.name}<span className="block text-xs text-brand/50">{o.customer.phone} · {o.customer.area === "inside" ? "Dhaka" : "Outside Dhaka"}</span></td>
                <td className="px-4 tabular-nums">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td className="px-4 text-right font-semibold tabular-nums">{formatTk(o.total)}</td>
                <td className="px-4">{o.payment === "cod" ? "COD" : "bKash"}</td>
                <td className="px-4">{statusSelect(o)}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-brand/50">{orders.length ? "No orders match." : "No orders yet. Orders placed on the store will show up here."}</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 fade-in" onClick={() => setOpenId(null)} />
          <aside className="fixed top-0 right-0 h-full w-full max-w-lg bg-cream z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 bg-brand text-cream">
              <h3 className="font-semibold">Order details</h3>
              <button onClick={() => setOpenId(null)} className="cursor-pointer" aria-label="Close"><CloseIcon /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="flex items-center gap-3"><span className="text-sm font-medium text-brand">Update status:</span>{statusSelect(open)}<StatusPill status={open.status} /></div>
              <OrderDetails order={open} />
              {open.customer.email && <p className="text-sm text-brand/70">Email: {open.customer.email}</p>}
              <a href={`tel:${open.customer.phone}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-brand-dk text-sm font-semibold">📞 Call customer</a>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
