"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import SectionHeading from "@/components/SectionHeading";
import { HeartIcon } from "@/components/Icons";
import { useCart } from "@/context/CartContext";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/context/ToastContext";
import { useWishlist } from "@/context/WishlistContext";
import { describe, formatTk } from "@/lib/products";
import { useHydrated } from "@/lib/useStoredState";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { productById, categoryOf, products, settings } = useShop();
  const { addToCart, cart } = useCart();
  const wishlist = useWishlist();
  const toast = useToast();
  const router = useRouter();
  const hydrated = useHydrated();
  const [qty, setQty] = useState(1);

  const p = productById(Number(id));
  if (!p) return <div className="max-w-7xl mx-auto px-4">{hydrated && <EmptyState icon="🔎" title="Product not found" text="It may have been removed or is no longer available." />}</div>;

  const cat = categoryOf(p.category);
  const inCart = cart.find(x => x.id === p.id)?.qty ?? 0;
  const canAdd = Math.max(0, p.stock - inCart);
  const soldOut = p.stock <= 0;
  const liked = wishlist.has(p.id);
  const related = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 5);
  const q = Math.min(qty, Math.max(canAdd, 1));

  const add = (thenCheckout = false) => {
    if (!addToCart(p, q)) { toast(canAdd ? `Only ${canAdd} more available` : "You already have all available stock in your cart", "error"); return; }
    setQty(1);
    if (thenCheckout) router.push("/checkout");
    else toast(`${q} × ${p.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <p className="mt-6 text-xs text-brand/60">
        <Link href="/" className="hover:underline">Home</Link>
        {cat && <> / <Link href={`/category/${cat.key}`} className="hover:underline">{cat.label}</Link></>} / {p.name}
      </p>

      <div className="mt-4 grid md:grid-cols-2 gap-6 md:gap-10">
        <ProductGallery key={p.id} product={p} dim={soldOut} />

        <div>
          {cat && <Link href={`/category/${cat.key}`} className="text-sm font-medium text-sage-dk hover:underline">{cat.icon} {cat.label}</Link>}
          <h1 className="mt-1 text-2xl md:text-4xl font-bold text-brand">{p.name}</h1>

          <p className="mt-4 text-3xl font-bold text-brand">{formatTk(p.price)}</p>
          <p className={`mt-1 text-sm font-medium ${soldOut ? "text-heart" : p.stock <= 5 ? "text-gold-dk" : "text-sage-dk"}`}>
            {soldOut ? "Out of stock" : p.stock <= 5 ? `Hurry! Only ${p.stock} left in stock` : `In stock: ${p.stock}`}
          </p>

          <p className="mt-5 text-brand/80 leading-relaxed">{describe(p, cat?.label)}</p>

          {!soldOut && (
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-medium text-brand">Quantity</span>
              <div className="flex items-center rounded-full border-2 border-sage bg-white">
                <button onClick={() => setQty(Math.max(1, q - 1))} className="w-10 h-10 text-lg cursor-pointer" aria-label="Decrease">−</button>
                <span className="w-10 text-center font-semibold">{q}</span>
                <button onClick={() => setQty(Math.min(canAdd, q + 1))} disabled={q >= canAdd} className="w-10 h-10 text-lg cursor-pointer disabled:opacity-30" aria-label="Increase">+</button>
              </div>
              {inCart > 0 && <span className="text-xs text-brand/60">{inCart} already in cart</span>}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => add()} disabled={soldOut || !canAdd} className="flex-1 min-w-40 py-3.5 rounded-full bg-brand hover:bg-brand-dk text-cream font-semibold transition-colors cursor-pointer disabled:bg-sage disabled:text-brand/40 disabled:cursor-not-allowed">
              {soldOut ? "Out of Stock" : "Add to Cart"}
            </button>
            <button onClick={() => add(true)} disabled={soldOut || !canAdd} className="flex-1 min-w-40 py-3.5 rounded-full bg-gold hover:bg-gold-dk text-brand-dk font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
              Buy Now
            </button>
            <button onClick={() => toast(wishlist.toggle(p.id) ? "Added to wishlist ♥" : "Removed from wishlist")} aria-label="Toggle wishlist"
              className={`w-13 h-13 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${liked ? "border-heart text-heart" : "border-sage text-brand/50 hover:text-heart"}`}>
              <HeartIcon filled={liked} />
            </button>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {[
              ["🚚", `Inside Dhaka ${formatTk(settings.deliveryInside)}`],
              ["📦", `Outside Dhaka ${formatTk(settings.deliveryOutside)}`],
              ["💵", "Cash on Delivery available"],
              ["↩️", "7-day easy returns"],
            ].map(([i, t]) => <li key={t} className="flex items-center gap-2 p-3 rounded-xl bg-white border border-sage text-brand"><span>{i}</span>{t}</li>)}
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <SectionHeading title="Related" accent="Products" href={cat ? `/category/${cat.key}` : "/shop"} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
            {related.map(r => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
