"use client";
import { useState } from "react";
import Link from "next/link";
import { PageHead, btnDanger, btnGhost, btnPrimary, card, field, label } from "@/components/admin/ui";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/context/ToastContext";
import { Category } from "@/lib/types";

const BLANK = { label: "", icon: "🛍️", blurb: "" };

export default function AdminCategoriesPage() {
  const { categories, products, saveCategory, deleteCategory } = useShop();
  const toast = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Category, "key">>(BLANK);
  const [error, setError] = useState("");

  const startEdit = (c: Category) => { setEditing(c.key); setForm({ label: c.label, icon: c.icon, blurb: c.blurb }); setError(""); };
  const reset = () => { setEditing(null); setForm(BLANK); setError(""); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label.trim()) return setError("Category name is required.");
    const existing = editing ? categories.find(c => c.key === editing) : undefined;
    const res = await saveCategory({ ...existing, ...form, label: form.label.trim(), key: editing ?? undefined });
    if (!res.ok) return setError(res.error);
    toast(editing ? "Category updated" : "Category added");
    reset();
  };

  const remove = async (c: Category) => {
    if (!window.confirm(`Delete category "${c.label}"?`)) return;
    const res = await deleteCategory(c.key);
    if (!res.ok) toast(res.error, "error");
    else { toast("Category deleted"); if (editing === c.key) reset(); }
  };

  return (
    <>
      <PageHead title="Categories" sub="Organise your products. Each category gets its own page on the store." />

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className={`${card} divide-y divide-sage`}>
          {categories.map(c => {
            const count = products.filter(p => p.category === c.key).length;
            return (
              <div key={c.key} className={`flex items-center gap-4 p-4 ${editing === c.key ? "bg-gold-lt/50" : ""}`}>
                <span className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center text-2xl shrink-0">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand">{c.label}</p>
                  <p className="text-xs text-brand/50 truncate">/category/{c.key} · {count} products</p>
                </div>
                <Link href={`/category/${c.key}`} target="_blank" className="text-xs text-brand/60 hover:text-brand">View</Link>
                <button onClick={() => startEdit(c)} className="text-xs font-semibold text-brand hover:underline cursor-pointer">Edit</button>
                <button onClick={() => remove(c)} className={btnDanger}>Delete</button>
              </div>
            );
          })}
          {categories.length === 0 && <p className="p-8 text-center text-brand/50 text-sm">No categories yet.</p>}
        </div>

        <form onSubmit={submit} className={`${card} p-5 space-y-4 lg:sticky lg:top-24`}>
          <h3 className="font-semibold text-brand">{editing ? "Edit category" : "Add category"}</h3>
          {error && <div className="px-3 py-2 rounded-lg bg-heart/10 text-heart text-sm">{error}</div>}
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div><label className={label}>Icon</label><input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} maxLength={4} className={`${field} text-2xl text-center`} /></div>
            <div><label className={label}>Name *</label><input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Bath & Body" className={field} /></div>
          </div>
          <div><label className={label}>Short description</label><textarea rows={3} value={form.blurb} onChange={e => setForm(f => ({ ...f, blurb: e.target.value }))} className={`${field} h-auto py-2.5`} /></div>
          {editing && <p className="text-xs text-brand/50">The page address (/category/{editing}) stays the same when you rename.</p>}
          <div className="flex gap-2">
            <button className={`${btnPrimary} flex-1`}>{editing ? "Save changes" : "Add category"}</button>
            {editing && <button type="button" onClick={reset} className={btnGhost}>Cancel</button>}
          </div>
        </form>
      </div>
    </>
  );
}
