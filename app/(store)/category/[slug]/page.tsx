"use client";
import { use } from "react";
import EmptyState from "@/components/EmptyState";
import PageBanner from "@/components/PageBanner";
import ProductListing from "@/components/ProductListing";
import { useShop } from "@/context/ShopContext";
import { useHydrated } from "@/lib/useStoredState";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { categoryOf, products } = useShop();
  const hydrated = useHydrated();
  const cat = categoryOf(slug);

  if (!cat) {
    // Admin-created categories only exist in the browser, so wait for hydration before declaring 404
    return <div className="max-w-7xl mx-auto px-4">{hydrated && <EmptyState icon="🔎" title="Category not found" text="It may have been renamed or removed." href="/categories" cta="See all categories" />}</div>;
  }

  const list = products.filter(p => p.category === cat.key);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <PageBanner crumbs={[["Categories", "/categories"], [cat.label]]} title={`${cat.icon} ${cat.label}`} subtitle={cat.blurb} />
      <ProductListing key={cat.key} products={list} activeCategory={cat.key} />
    </div>
  );
}
