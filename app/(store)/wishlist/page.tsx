"use client";
import EmptyState from "@/components/EmptyState";
import PageBanner from "@/components/PageBanner";
import ProductCard from "@/components/ProductCard";
import { useShop } from "@/context/ShopContext";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const { products } = useShop();
  const items = products.filter(p => ids.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4">
      <PageBanner crumbs={[["Wishlist"]]} script="Things you love" title={`My Wishlist (${items.length})`} tone="gold" />
      {items.length === 0 ? (
        <EmptyState icon="💚" title="Your wishlist is empty" text="Tap the heart on any product to save it here." />
      ) : (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
