"use client";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useShop } from "@/context/ShopContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { formatTk, isNew } from "@/lib/products";
import { HeartIcon } from "./Icons";
import ProductImage from "./ProductImage";

export default function ProductCard({ product: p }: { product: Product }) {
  const { addToCart } = useCart();
  const { categoryOf } = useShop();
  const wishlist = useWishlist();
  const toast = useToast();
  const soldOut = p.stock <= 0;
  const liked = wishlist.has(p.id);
  const href = `/product/${p.id}`;

  const add = () => {
    if (addToCart(p)) toast(`${p.emoji} ${p.name} added to cart`);
    else toast(`Only ${p.stock} in stock`, "error");
  };

  const like = () => toast(wishlist.toggle(p.id) ? "Added to wishlist ♥" : "Removed from wishlist");

  return (
    <div className="bg-white rounded-2xl border border-sage overflow-hidden flex flex-col hover:border-brand">
      <div className="relative aspect-square bg-gradient-to-br from-sage/60 to-cream flex items-center justify-center overflow-hidden">
        <Link href={href} className="absolute inset-0 flex items-center justify-center" aria-label={p.name}>
          <ProductImage product={p} className="text-6xl md:text-7xl" dim={soldOut} />
        </Link>
        {isNew(p) && <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-brand text-gold text-[11px] font-bold">NEW</span>}
        <button onClick={like} aria-label="Toggle wishlist"
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer transition-colors ${liked ? "text-heart" : "text-brand/40 hover:text-heart"}`}>
          <HeartIcon className="w-4 h-4" filled={liked} />
        </button>
      </div>

      <div className="p-3 md:p-4 flex flex-col flex-1">
        <span className="text-[11px] text-sage-dk font-medium">{categoryOf(p.category)?.label ?? "Uncategorised"}</span>
        <Link href={href} className="font-semibold text-sm leading-snug line-clamp-2 hover:text-gold-dk">{p.name}</Link>
        <span className="mt-1 text-lg font-bold text-brand">{formatTk(p.price)}</span>
        <p className={`text-[11px] mt-0.5 mb-3 ${soldOut ? "text-heart" : p.stock <= 5 ? "text-gold-dk" : "text-sage-dk"}`}>
          {soldOut ? "Out of stock" : p.stock <= 5 ? `Only ${p.stock} left!` : `In stock: ${p.stock}`}
        </p>
        <button onClick={add} disabled={soldOut}
          className="mt-auto w-full py-2.5 rounded-full text-sm font-semibold cursor-pointer bg-brand text-cream hover:bg-gold hover:text-brand-dk disabled:bg-sage disabled:text-brand/40 disabled:cursor-not-allowed">
          {soldOut ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
