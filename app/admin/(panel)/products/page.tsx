"use client";
import { use, useMemo, useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { PageHead, btnDanger, btnGold, card, field } from "@/components/admin/ui";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/context/ToastContext";
import { formatTk, isFeatured, isNew } from "@/lib/products";

export default function AdminProductsPage({ searchParams }: { searchParams: Promise<{ stock?: string }> }) {
  const { stock } = use(searchParams);
  const { products, categories, categoryOf, deleteProduct, saveProduct } = useShop();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [stockFilter, setStockFilter] = useState(stock === "low" ? "low" : "all");

  const list = useMemo(() => products.filter(p =>
    (cat === "all" || p.category === cat) &&
    (!q || p.name.toLowerCase().includes(q.toLowerCase())) &&
    (stockFilter === "all" || (stockFilter === "low" ? p.stock > 0 && p.stock <= 5 : p.stock <= 0))
  ), [products, cat, q, stockFilter]);

  const remove = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await deleteProduct(id);
    toast(res.ok ? "Product deleted" : `Couldn't delete: ${res.error}`, res.ok ? "success" : "error");
  };

  const setStock = (id: number, value: string) => {
    const p = products.find(x => x.id === id);
    const n = Math.max(0, Math.floor(Number(value) || 0));
    if (p && n !== p.stock) saveProduct({ ...p, stock: n }).then(res => { if (!res.ok) toast(`Couldn't update stock: ${res.error}`, "error"); });
  };

  return (
    <>
      <PageHead title="Products" sub={`${products.length} products in your catalogue`} action={<Link href="/admin/products/new" className={btnGold}>+ Add Product</Link>} />

      <div className={`${card} p-3 mb-4 flex flex-wrap gap-3`}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products…" className={`${field} flex-1 min-w-48`} />
        <select value={cat} onChange={e => setCat(e.target.value)} className={`${field} w-auto`}>
          <option value="all">All categories</option>
          {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className={`${field} w-auto`}>
          <option value="all">Any stock</option>
          <option value="low">Low stock (1–5)</option>
          <option value="out">Out of stock</option>
        </select>
      </div>

      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs text-brand/60 bg-cream/60">
              <th className="px-4 py-3">Product</th><th className="px-4">Category</th><th className="px-4 text-right">Price</th><th className="px-4 text-center">Stock</th><th className="px-4">Tag</th><th className="px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id} className="border-t border-sage">
                <td className="px-4 py-2.5">
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 hover:text-gold-dk">
                    <span className="w-11 h-11 rounded-lg bg-sage flex items-center justify-center overflow-hidden shrink-0"><ProductImage product={p} className="text-xl" /></span>
                    <span className="font-medium">{p.name}</span>
                  </Link>
                </td>
                <td className="px-4 text-brand/70">{categoryOf(p.category)?.label ?? <span className="text-heart">Missing</span>}</td>
                <td className="px-4 text-right tabular-nums">
                  <b>{formatTk(p.price)}</b>
                </td>
                <td className="px-4 text-center">
                  <input type="number" min={0} defaultValue={p.stock} key={p.stock} onBlur={e => setStock(p.id, e.target.value)} onKeyDown={e => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                    aria-label={`Stock for ${p.name}`}
                    className={`w-20 h-9 rounded-lg border-2 text-center tabular-nums focus:outline-none focus:border-brand ${p.stock <= 0 ? "border-heart/40 text-heart" : p.stock <= 5 ? "border-gold/60 text-gold-dk" : "border-sage"}`} />
                </td>
                <td className="px-4 whitespace-nowrap">{[isFeatured(p) && "🔥 Featured", isNew(p) && "✨ New"].filter(Boolean).join(" · ") || "—"}</td>
                <td className="px-4 text-right whitespace-nowrap">
                  <Link href={`/product/${p.id}`} target="_blank" className="text-xs text-brand/60 hover:text-brand mr-2">View</Link>
                  <Link href={`/admin/products/${p.id}`} className="text-xs font-semibold text-brand hover:underline mr-1">Edit</Link>
                  <button onClick={() => remove(p.id, p.name)} className={btnDanger}>Delete</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-brand/50">No products match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
