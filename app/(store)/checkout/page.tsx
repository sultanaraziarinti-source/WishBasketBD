"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import PageBanner from "@/components/PageBanner";
import ProductImage from "@/components/ProductImage";
import { inputCls, labelCls } from "@/components/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/context/ToastContext";
import { formatTk } from "@/lib/products";
import { Order } from "@/lib/types";
import { useHydrated } from "@/lib/useStoredState";

const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { settings, placeOrder } = useShop();
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const hydrated = useHydrated();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", note: "" });
  const [area, setArea] = useState<"inside" | "outside">("inside");
  const [payment, setPayment] = useState<"cod" | "bkash">("cod");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!hydrated) return null;
  if (cart.length === 0) return <div className="max-w-7xl mx-auto px-4"><EmptyState icon="🧺" title="Your cart is empty" text="Add a few things you love, then come back to check out." /></div>;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  const fee = cartTotal >= settings.freeDeliveryAt ? 0 : area === "inside" ? settings.deliveryInside : settings.deliveryOutside;
  const total = cartTotal + fee;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = form.phone.replace(/[\s-]/g, "");
    if (!BD_PHONE.test(phone)) { setError("Please enter a valid Bangladeshi mobile number, e.g. 01712345678."); return; }
    const order: Omit<Order, "id" | "createdAt" | "status"> = {
      items: cart.map(i => ({ id: i.id, name: i.name, emoji: i.emoji, image: i.image, price: i.price, qty: i.qty })),
      subtotal: cartTotal, delivery: fee, total, payment,
      userEmail: user?.email,
      customer: { name: form.name.trim(), phone, email: form.email.trim() || user?.email, address: form.address.trim(), area, note: form.note.trim() || undefined },
    };
    setBusy(true);
    const res = await placeOrder(order);
    setBusy(false);
    if (!res.ok) {
      setError(res.error === "OUT_OF_STOCK" ? "Some items just went out of stock. Please review your cart." : `Couldn't place the order: ${res.error}`);
      return;
    }
    clearCart();
    toast("Order placed successfully! 🎉");
    router.push(`/order/${res.value}`);
  };

  const option = (on: boolean, onClick: () => void, title: string, sub: string) => (
    <button type="button" onClick={onClick} className={`text-left p-4 rounded-2xl border-2 cursor-pointer transition-colors ${on ? "border-brand bg-sage/50" : "border-sage bg-white hover:border-sage-dk"}`}>
      <span className="flex items-center gap-2 font-semibold text-brand"><span className={`w-4 h-4 rounded-full border-2 ${on ? "border-brand bg-brand shadow-[inset_0_0_0_2px_white]" : "border-sage-dk"}`} />{title}</span>
      <span className="block text-xs text-brand/60 mt-1 ml-6">{sub}</span>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      <PageBanner crumbs={[["Checkout"]]} title="Checkout" subtitle="Almost there! Tell us where to deliver your basket." />

      <form onSubmit={submit} className="mt-6 grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        <div className="space-y-6">
          <section className="bg-white rounded-3xl border border-sage p-5 md:p-6">
            <h2 className="text-lg font-bold text-brand mb-4">1. Delivery Information</h2>
            {error && <div className="mb-4 px-4 py-3 rounded-xl bg-heart/10 text-heart text-sm">{error}</div>}
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Full Name *</label><input required value={form.name} onChange={set("name")} placeholder="Your full name" className={inputCls} /></div>
              <div><label className={labelCls}>Mobile Number *</label><input required type="tel" value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" className={inputCls} /></div>
              <div className="sm:col-span-2"><label className={labelCls}>Email (optional)</label><input type="email" value={form.email} onChange={set("email")} placeholder={user?.email ?? "you@example.com"} className={inputCls} /></div>
              <div className="sm:col-span-2"><label className={labelCls}>Full Address *</label><textarea required rows={3} value={form.address} onChange={set("address")} placeholder="House, road, area, thana, district" className={`${inputCls} h-auto py-3`} /></div>
              <div className="sm:col-span-2"><label className={labelCls}>Order Note (optional)</label><input value={form.note} onChange={set("note")} placeholder="Gift wrap, delivery time, etc." className={inputCls} /></div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-sage p-5 md:p-6">
            <h2 className="text-lg font-bold text-brand mb-4">2. Delivery Area</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {option(area === "inside", () => setArea("inside"), `Inside Dhaka — ${formatTk(settings.deliveryInside)}`, "Delivered in 1–2 days")}
              {option(area === "outside", () => setArea("outside"), `Outside Dhaka — ${formatTk(settings.deliveryOutside)}`, "Delivered in 3–5 days")}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-sage p-5 md:p-6">
            <h2 className="text-lg font-bold text-brand mb-4">3. Payment Method</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {option(payment === "cod", () => setPayment("cod"), "💵 Cash on Delivery", "Pay when you receive your order")}
              {option(payment === "bkash", () => setPayment("bkash"), "📱 bKash", "We'll call you to confirm payment")}
            </div>
          </section>
        </div>

        <aside className="bg-white rounded-3xl border border-sage p-5 md:p-6 lg:sticky lg:top-40">
          <h2 className="text-lg font-bold text-brand mb-4">Order Summary</h2>
          <ul className="space-y-3 max-h-72 overflow-y-auto">
            {cart.map(i => (
              <li key={i.id} className="flex items-center gap-3">
                <span className="relative w-12 h-12 rounded-xl bg-sage flex items-center justify-center overflow-hidden shrink-0">
                  <ProductImage product={i} className="text-2xl" />
                </span>
                <span className="flex-1 min-w-0 text-sm"><span className="block truncate font-medium">{i.name}</span><span className="text-brand/60">{i.qty} × {formatTk(i.price)}</span></span>
                <span className="text-sm font-semibold">{formatTk(i.qty * i.price)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 pt-4 border-t border-sage space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-brand/70">Subtotal</dt><dd>{formatTk(cartTotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-brand/70">Delivery</dt><dd>{fee ? formatTk(fee) : <span className="text-sage-dk font-semibold">FREE</span>}</dd></div>
            <div className="flex justify-between pt-2 border-t border-sage text-lg font-bold text-brand"><dt>Total</dt><dd>{formatTk(total)}</dd></div>
          </dl>
          <button disabled={busy} className="mt-5 w-full py-3.5 rounded-full bg-gold hover:bg-gold-dk text-brand-dk font-bold transition-colors cursor-pointer disabled:opacity-60">{busy ? "Placing order…" : <>Place Order · {formatTk(total)}</>}</button>
          <p className="mt-3 text-xs text-center text-brand/50">By placing your order you agree to our delivery & return policy.</p>
        </aside>
      </form>
    </div>
  );
}
