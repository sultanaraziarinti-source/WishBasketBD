"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/lib/types";

type Sort = "default" | "price-asc" | "price-desc";

interface Props {
  products: Product[];
  activeCategory?: string;
  // Price range slider bounds are computed from the products passed in
}

// Shared grid with category pills and sorting — used by /shop and /category/[slug]
export default function ProductListing({ products, activeCategory }: Props) {
  const { categories } = useShop();
  const [sort, setSort] = useState<Sort>("default");

  const list = useMemo(() => {
    let l = products;
    if (sort === "price-asc") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") l = [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [products, sort]);

  const pill = (href: string, label: string, on: boolean) => (
    <Link key={href} href={href} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${on ? "bg-brand text-cream" : "bg-white border border-sage text-brand hover:border-brand"}`}>{label}</Link>
  );

  return (
    <>
      <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {pill("/shop", "All", !activeCategory)}
        {categories.map(c => pill(`/category/${c.key}`, `${c.icon} ${c.label}`, activeCategory === c.key))}
      </div>

      <div className="mt-4 flex justify-end">
        <select value={sort} onChange={e => setSort(e.target.value as Sort)} className="h-10 px-3 rounded-full border border-sage bg-white text-sm text-brand focus:outline-none focus:border-brand cursor-pointer">
          <option value="default">Sort: Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      <p className="mt-4 text-sm text-brand/60">Showing <b className="text-brand">{list.length}</b> of {products.length} products</p>

      {list.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-3">🧺</div>
          <p className="font-semibold text-brand">No products found</p>
          <p className="text-sm text-brand/60">Try another category.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
          {list.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </>
  );
}
