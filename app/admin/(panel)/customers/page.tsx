"use client";
import { useState } from "react";
import { PageHead, card, field } from "@/components/admin/ui";
import { useShop } from "@/context/ShopContext";
import { formatDate, formatTk } from "@/lib/products";

interface Row { key: string; name: string; email?: string; phone?: string; registered: boolean; orders: number; spent: number; last?: string; }

export default function AdminCustomersPage() {
  const { users, orders } = useShop();
  const [q, setQ] = useState("");

  // Registered accounts plus guest buyers (grouped by phone)
  const rows = new Map<string, Row>();
  users.forEach(u => rows.set(u.email, { key: u.email, name: `${u.firstName} ${u.lastName}`, email: u.email, registered: true, orders: 0, spent: 0, last: u.createdAt }));
  orders.forEach(o => {
    const key = o.userEmail ?? `phone:${o.customer.phone}`;
    const r = rows.get(key) ?? { key, name: o.customer.name, email: o.customer.email, registered: false, orders: 0, spent: 0 };
    r.phone ??= o.customer.phone;
    r.orders += 1;
    if (o.status !== "cancelled") r.spent += o.total;
    if (!r.last || o.createdAt > r.last) r.last = o.createdAt;
    rows.set(key, r);
  });
  const list = [...rows.values()]
    .filter(r => !q || [r.name, r.email, r.phone].some(v => v?.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => b.spent - a.spent);

  return (
    <>
      <PageHead title="Customers" sub={`${users.length} registered · ${rows.size - users.length} guest buyers`} />
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email or phone…" className={`${field} mb-4 max-w-md`} />
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-sm min-w-[680px]">
          <thead>
            <tr className="text-left text-xs text-brand/60 bg-cream/60">
              <th className="px-4 py-3">Customer</th><th className="px-4">Contact</th><th className="px-4">Type</th><th className="px-4 text-right">Orders</th><th className="px-4 text-right">Spent</th><th className="px-4">Last activity</th>
            </tr>
          </thead>
          <tbody>
            {list.map(r => (
              <tr key={r.key} className="border-t border-sage">
                <td className="px-4 py-3 font-medium">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-brand text-gold text-xs font-bold flex items-center justify-center">{r.name.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase()}</span>
                    {r.name}
                  </span>
                </td>
                <td className="px-4 text-brand/70">{r.email ?? "—"}<span className="block text-xs">{r.phone ?? ""}</span></td>
                <td className="px-4">{r.registered ? <span className="px-2 py-0.5 rounded-full bg-sage text-brand text-xs font-semibold">Registered</span> : <span className="px-2 py-0.5 rounded-full bg-gold-lt text-gold-dk text-xs font-semibold">Guest</span>}</td>
                <td className="px-4 text-right tabular-nums">{r.orders}</td>
                <td className="px-4 text-right font-semibold tabular-nums">{formatTk(r.spent)}</td>
                <td className="px-4 text-xs text-brand/60">{r.last ? formatDate(r.last) : "—"}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-brand/50">No customers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
