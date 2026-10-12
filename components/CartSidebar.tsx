"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useShop } from "@/context/ShopContext";
import { formatTk } from "@/lib/products";
import { BagIcon, CloseIcon } from "./Icons";
import ProductImage from "./ProductImage";

export default function CartSidebar() {
  const { cart, isOpen, closeCart, changeQty, removeFromCart, cartTotal, cartCount } = useCart();
  const { settings } = useShop();
  const remaining = settings.freeDeliveryAt - cartTotal;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40 fade-in" onClick={closeCart} />}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-cream z-50 flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 bg-brand text-cream">
          <h3 className="font-semibold text-lg">Your Cart ({cartCount})</h3>
          <button onClick={closeCart} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer" aria-label="Close cart"><CloseIcon /></button>
        </div>

        {cart.length > 0 && (
          <div className="px-5 py-3 bg-gold-lt text-xs text-brand-dk">
            {remaining > 0 ? <>Add <b>{formatTk(remaining)}</b> more for <b>free delivery</b> 🚚</> : <b>🎉 You&apos;ve unlocked free delivery!</b>}
            <div className="mt-2 h-1.5 rounded-full bg-white overflow-hidden">
              <div className="h-full bg-brand transition-all" style={{ width: `${Math.min(100, (cartTotal / settings.freeDeliveryAt) * 100)}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-20 h-20 rounded-full bg-sage text-brand flex items-center justify-center"><BagIcon className="w-9 h-9" /></div>
              <p className="font-semibold">Your cart is empty</p>
              <p className="text-brand/60 text-sm">Fill your basket with things you love.</p>
              <Link href="/shop" onClick={closeCart} className="mt-2 px-6 py-2.5 rounded-full bg-brand text-cream text-sm font-semibold">Continue Shopping</Link>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-sage">
              <Link href={`/product/${item.id}`} onClick={closeCart} className="w-14 h-14 rounded-xl bg-sage flex items-center justify-center overflow-hidden shrink-0">
                <ProductImage product={item} className="text-3xl" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-brand font-bold text-sm">{formatTk(item.price)}</p>
                <div className="mt-1 flex items-center gap-1">
                  <button onClick={() => changeQty(item.id, -1)} className="w-6 h-6 rounded-full border border-sage text-sm hover:bg-sage cursor-pointer">−</button>
                  <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)} disabled={item.qty >= item.stock} className="w-6 h-6 rounded-full border border-sage text-sm hover:bg-sage cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">+</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-brand/40 hover:text-heart cursor-pointer" aria-label={`Remove ${item.name}`}><CloseIcon className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-sage bg-white">
            <div className="flex justify-between items-center mb-3">
              <span className="text-brand/70">Subtotal</span>
              <span className="text-xl font-bold">{formatTk(cartTotal)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="block text-center w-full py-3.5 rounded-full bg-gold hover:bg-gold-dk text-brand-dk font-bold text-sm transition-colors">
              Proceed to Checkout →
            </Link>
            <button onClick={closeCart} className="w-full mt-2 py-2 text-sm text-brand/70 hover:text-brand cursor-pointer">Continue Shopping</button>
          </div>
        )}
      </aside>
    </>
  );
}
