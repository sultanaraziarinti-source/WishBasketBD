"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import { PageHead, btnGhost, btnPrimary, card, field, label } from "@/components/admin/ui";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/context/ToastContext";
import { Product } from "@/lib/types";
import { isFeatured, isNew, photosOf } from "@/lib/products";
import TagToggles from "@/components/admin/TagToggles";
import PhotosPicker from "@/components/admin/PhotosPicker";

type Draft = Omit<Product, "id">;

export default function ProductEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const { productById, categories, saveProduct } = useShop();
  const existing = isNew ? undefined : productById(Number(id));

  if (!isNew && !existing) {
    return <div className="text-center py-20"><p className="font-semibold text-brand">Product not found.</p><Link href="/admin/products" className="underline text-sm">Back to products</Link></div>;
  }

  const initial: Draft = existing ?? {
    name: "", category: categories[0]?.key ?? "", emoji: "🛍️", image: undefined, description: "",
    price: 0, oldPrice: null, featured: false, newArrival: true, stock: 10, rating: 5,
  };

  return <Editor key={id} initial={initial} id={existing?.id} save={saveProduct} categories={categories} />;
}

function Editor({ initial, id, save, categories }: { initial: Draft; id?: number; save: ReturnType<typeof useShop>["saveProduct"]; categories: ReturnType<typeof useShop>["categories"] }) {
  const router = useRouter();
  const toast = useToast();
  const [d, setD] = useState<Draft>(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD(cur => ({ ...cur, [k]: v }));

  const photos = photosOf(d);
  const setPhotos = (list: string[]) => setD(cur => ({ ...cur, image: list[0], images: list.slice(1) }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.name.trim()) return setError("Product name is required.");
    if (!d.category) return setError("Please choose a category.");
    if (d.price <= 0) return setError("Price must be greater than 0.");
    setBusy(true);
    const res = await save({ ...d, oldPrice: null, name: d.name.trim(), id });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    toast(id ? "Product updated" : "Product added");
    router.push("/admin/products");
  };

  const num = (v: string) => Math.max(0, Number(v) || 0);

  return (
    <form onSubmit={submit}>
      <PageHead title={id ? "Edit product" : "Add product"} sub={id ? `#${id}` : "Create a new product for your store"}
        action={<div className="flex gap-2"><Link href="/admin/products" className={btnGhost}>Cancel</Link><button disabled={busy} className={btnPrimary}>{busy ? "Saving…" : id ? "Save changes" : "Add product"}</button></div>} />

      {error && <div className="mb-4 px-4 py-3 rounded-xl bg-heart/10 text-heart text-sm">{error}</div>}

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="space-y-6">
          <section className={`${card} p-5 space-y-4`}>
            <h3 className="font-semibold text-brand">Basic information</h3>
            <div><label className={label}>Product name *</label><input value={d.name} onChange={e => set("name", e.target.value)} className={field} placeholder="e.g. Ceramic Coffee Mug" /></div>
            <div><label className={label}>Description</label><textarea rows={5} value={d.description ?? ""} onChange={e => set("description", e.target.value)} className={`${field} h-auto py-2.5`} placeholder="Material, size, care instructions… (leave empty for an automatic description)" /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Category *</label>
                <select value={d.category} onChange={e => set("category", e.target.value)} className={field}>
                  {categories.map(c => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Show on home page as</label>
                <TagToggles featured={isFeatured(d)} newArrival={isNew(d)} onChange={t => setD(cur => ({ ...cur, ...t, badge: null }))} />
              </div>
            </div>
          </section>

          <section className={`${card} p-5 space-y-4`}>
            <h3 className="font-semibold text-brand">Pricing & inventory</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={label}>Price (৳) *</label><input type="number" min={0} value={d.price || ""} onChange={e => set("price", num(e.target.value))} className={field} /></div>
              <div><label className={label}>Stock quantity *</label><input type="number" min={0} value={d.stock} onChange={e => set("stock", Math.floor(num(e.target.value)))} className={field} /></div>
            </div>
          </section>
        </div>

        <section className={`${card} p-5 space-y-4`}>
          <h3 className="font-semibold text-brand">Photos</h3>
          {photos.length === 0 && (
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-sage to-cream flex items-center justify-center overflow-hidden">
              <ProductImage product={{ name: d.name, emoji: d.emoji }} className="text-8xl" />
            </div>
          )}
          <PhotosPicker photos={photos} onChange={setPhotos} onError={setError} />
          <div>
            <label className={label}>Emoji (shown when there&apos;s no photo)</label>
            <input value={d.emoji} onChange={e => set("emoji", e.target.value)} maxLength={4} className={`${field} text-2xl text-center`} />
          </div>
        </section>
      </div>
    </form>
  );
}
