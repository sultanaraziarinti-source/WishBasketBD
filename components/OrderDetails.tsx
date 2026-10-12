import ProductImage from "./ProductImage";
import { ORDER_STATUSES, formatDate, formatTk, statusOf } from "@/lib/products";
import { Order } from "@/lib/types";

export function StatusPill({ status }: { status: Order["status"] }) {
  const s = statusOf(status);
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

const STEPS = ORDER_STATUSES.filter(s => s.key !== "cancelled");

export function OrderProgress({ status }: { status: Order["status"] }) {
  if (status === "cancelled") return <p className="px-4 py-3 rounded-xl bg-heart/10 text-heart text-sm font-medium">This order was cancelled.</p>;
  const at = STEPS.findIndex(s => s.key === status);
  return (
    <ol className="grid grid-cols-4 gap-1">
      {STEPS.map((s, i) => (
        <li key={s.key} className="text-center">
          <div className={`h-1.5 rounded-full ${i <= at ? "bg-brand" : "bg-sage"}`} />
          <span className={`mt-1.5 block text-[11px] md:text-xs ${i <= at ? "text-brand font-semibold" : "text-brand/40"}`}>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}

export default function OrderDetails({ order: o }: { order: Order }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs text-brand/60">Order ID</p>
          <p className="font-bold text-brand text-lg">#{o.id}</p>
        </div>
        <div className="text-right">
          <StatusPill status={o.status} />
          <p className="text-xs text-brand/60 mt-1">{formatDate(o.createdAt)}</p>
        </div>
      </div>
      <OrderProgress status={o.status} />

      <ul className="divide-y divide-sage">
        {o.items.map(i => (
          <li key={i.id} className="py-3 flex items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center overflow-hidden shrink-0"><ProductImage product={i} className="text-2xl" /></span>
            <span className="flex-1 min-w-0 text-sm"><span className="block font-medium truncate">{i.name}</span><span className="text-brand/60">{i.qty} × {formatTk(i.price)}</span></span>
            <span className="text-sm font-semibold">{formatTk(i.qty * i.price)}</span>
          </li>
        ))}
      </ul>

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div className="p-4 rounded-2xl bg-cream border border-sage">
          <p className="font-semibold text-brand mb-1">Deliver to</p>
          <p>{o.customer.name} · {o.customer.phone}</p>
          <p className="text-brand/70">{o.customer.address}</p>
          <p className="text-brand/70">{o.customer.area === "inside" ? "Inside Dhaka" : "Outside Dhaka"}</p>
          {o.customer.note && <p className="mt-1 text-brand/70">Note: {o.customer.note}</p>}
        </div>
        <dl className="p-4 rounded-2xl bg-cream border border-sage space-y-1">
          <div className="flex justify-between"><dt className="text-brand/70">Payment</dt><dd>{o.payment === "cod" ? "Cash on Delivery" : "bKash"}</dd></div>
          <div className="flex justify-between"><dt className="text-brand/70">Subtotal</dt><dd>{formatTk(o.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-brand/70">Delivery</dt><dd>{o.delivery ? formatTk(o.delivery) : "FREE"}</dd></div>
          <div className="flex justify-between pt-1 border-t border-sage font-bold text-brand"><dt>Total</dt><dd>{formatTk(o.total)}</dd></div>
        </dl>
      </div>
    </div>
  );
}
