"use client";
import Link from "next/link";
import CategoryImage from "@/components/CategoryImage";
import PageBanner from "@/components/PageBanner";
import { useShop } from "@/context/ShopContext";
import { tintFor } from "@/lib/products";

export default function CategoriesPage() {
  const { categories, products } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4">
      <PageBanner crumbs={[["Categories"]]} script="Shop by" title="All Categories" subtitle="Browse our handpicked collections for every corner of your home." />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {categories.map((c, i) => {
          const count = products.filter(p => p.category === c.key).length;
          return (
            <Link key={c.key} href={`/category/${c.key}`} className={`group relative overflow-hidden rounded-3xl ${tintFor(i)} p-6 flex items-center gap-5 border-2 border-transparent hover:border-brand`}>
              <span className="w-24 h-24 rounded-2xl bg-white/70 flex items-center justify-center overflow-hidden shrink-0"><CategoryImage category={c} /></span>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-brand">{c.label}</h2>
                <p className="text-sm text-brand/70 line-clamp-2">{c.blurb}</p>
                <span className="mt-2 inline-block text-xs font-semibold text-gold-dk">{count} products · Shop now →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
