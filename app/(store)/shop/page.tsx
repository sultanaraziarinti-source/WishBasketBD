"use client";
import { use } from "react";
import { redirect } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import ProductListing from "@/components/ProductListing";
import { useShop } from "@/context/ShopContext";

export default function ShopPage({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string }> }) {
  const { cat, q = "" } = use(searchParams);
  if (cat) redirect(`/category/${cat}`);

  const { products } = useShop();
  const term = q.trim().toLowerCase();
  const list = term ? products.filter(p => p.name.toLowerCase().includes(term)) : products;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <PageBanner crumbs={[["Shop"]]} title={term ? `Results for “${q}”` : "All Products"} subtitle="Your favorite finds, delivered with care." />
      <ProductListing key={term} products={list} />
    </div>
  );
}
