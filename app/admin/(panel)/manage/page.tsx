"use client";
import { useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import PhotosPicker from "@/components/admin/PhotosPicker";
import TagToggles from "@/components/admin/TagToggles";
import { card, field, label } from "@/components/admin/ui";
import { useShop } from "@/context/ShopContext";
import { formatTk, photosOf, slugify } from "@/lib/products";
import { resizeImage } from "@/lib/resizeImage";

type Msg = { text: string; ok: boolean } | null;

function Notice({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return <div className={`mb-4 px-4 py-3 text-sm rounded-xl border ${msg.ok ? "bg-sage border-sage-dk/30 text-brand" : "bg-heart/10 border-heart/30 text-heart"}`}>{msg.text}</div>;
}

// Image picker that shows a preview and returns a resized data URL
function ImagePicker({ value, onChange, onError }: { value?: string; onChange: (v?: string) => void; onError: (m: string) => void }) {
  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return onError("Please choose an image file.");
    try { onChange(await resizeImage(file)); } catch { onError("Couldn't read that image. Try a JPG or PNG."); }
  };
  return (
    <div>
      <input type="file" accept="image/*" onChange={pick}
        className="w-full text-sm text-brand/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold-lt file:text-brand-dk hover:file:bg-gold/40 cursor-pointer" />
      {value && (
        <div className="mt-3 flex items-end gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- data URL preview */}
          <img src={value} alt="preview" className="w-24 h-24 object-cover rounded-xl border border-sage" />
          <button type="button" onClick={() => onChange(undefined)} className="text-xs text-heart hover:underline cursor-pointer">Remove image</button>
        </div>
      )}
    </div>
  );
}

const saveBtn = "py-3 px-7 rounded-xl bg-brand hover:bg-brand-dk text-cream font-bold text-sm cursor-pointer disabled:opacity-60";

export default function ManagePage() {
  const { categories, products, categoryOf, saveCategory, deleteCategory, saveProduct, deleteProduct } = useShop();

  // Add Category
  const [catName, setCatName] = useState("");
  const [catIcon, setCatIcon] = useState("🛍️");
  const [catImage, setCatImage] = useState<string>();
  const [catMsg, setCatMsg] = useState<Msg>(null);

  // Add Item
  const [itemCat, setItemCat] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPhotos, setItemPhotos] = useState<string[]>([]);
  const [itemPrice, setItemPrice] = useState("");
  const [itemStock, setItemStock] = useState("10");
  const [itemTags, setItemTags] = useState({ featured: false, newArrival: true });
  // Items added during this visit — only these are listed below
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const [busy, setBusy] = useState<"cat" | "item" | null>(null);
  const [itemMsg, setItemMsg] = useState<Msg>(null);

  // Remove
  const [removeType, setRemoveType] = useState<"" | "category" | "item">("");
  const [removeTarget, setRemoveTarget] = useState("");
  const [removeMsg, setRemoveMsg] = useState<Msg>(null);

  // Picking an existing category loads it so its image/icon can be changed
  const pickCategory = (name: string) => {
    setCatName(name);
    const existing = categories.find(c => c.label.toLowerCase() === name.trim().toLowerCase());
    if (existing) { setCatIcon(existing.icon); setCatImage(existing.image); }
  };

  const justAdded = addedIds.flatMap(id => products.filter(p => p.id === id));

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = catName.trim();
    if (!name) return setCatMsg({ text: "Please enter a category name.", ok: false });
    const existing = categories.find(c => c.label.toLowerCase() === name.toLowerCase() || c.key === slugify(name));
    setBusy("cat");
    const res = await saveCategory(existing
      ? { ...existing, label: name, icon: catIcon || existing.icon, image: catImage }
      : { label: name, icon: catIcon || "🛍️", blurb: "", image: catImage });
    setBusy(null);
    if (!res.ok) return setCatMsg({ text: res.error, ok: false });
    setCatName(""); setCatIcon("🛍️"); setCatImage(undefined);
    setCatMsg({ text: existing ? "Category updated ✓" : "Category saved ✓", ok: true });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(itemPrice);
    if (!itemCat || !itemName.trim() || !itemPrice.trim()) return setItemMsg({ text: "Please choose a category and enter an item name and price.", ok: false });
    if (!(price > 0)) return setItemMsg({ text: "Price must be greater than 0.", ok: false });
    setBusy("item");
    const res = await saveProduct({
      name: itemName.trim(), category: itemCat, emoji: categoryOf(itemCat)?.icon ?? "🛍️", image: itemPhotos[0], images: itemPhotos.slice(1),
      price, oldPrice: null, ...itemTags, stock: Math.max(0, Math.floor(Number(itemStock) || 0)), rating: 5,
    });
    setBusy(null);
    if (!res.ok) return setItemMsg({ text: res.error, ok: false });
    const id = res.value;
    setItemName(""); setItemPhotos([]); setItemPrice(""); setItemStock("10"); setItemTags({ featured: false, newArrival: true });
    setAddedIds(ids => [id, ...ids]);
    setItemMsg({ text: "Item saved ✓", ok: true });
  };

  const handleRemove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!removeType) return setRemoveMsg({ text: "Please choose what to remove.", ok: false });
    if (!removeTarget) return setRemoveMsg({ text: `Please choose the ${removeType} to remove.`, ok: false });
    if (removeType === "category") {
      const c = categoryOf(removeTarget);
      const count = products.filter(p => p.category === removeTarget).length;
      if (!c) return;
      if (!window.confirm(`Remove "${c.label}"${count ? ` and its ${count} item(s)` : ""}? This cannot be undone.`)) return;
      const res = await deleteCategory(removeTarget, true);
      if (!res.ok) return setRemoveMsg({ text: res.error, ok: false });
      setRemoveMsg({ text: count ? "Category and its items removed ✓" : "Category removed ✓", ok: true });
    } else {
      const p = products.find(x => String(x.id) === removeTarget);
      if (!p || !window.confirm(`Remove "${p.name}"? This cannot be undone.`)) return;
      const res = await deleteProduct(p.id);
      if (!res.ok) return setRemoveMsg({ text: res.error, ok: false });
      setRemoveMsg({ text: "Item removed ✓", ok: true });
    }
    setRemoveTarget("");
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-extrabold text-brand-dk mb-1">Manage Store</h2>
      <p className="text-brand/60 mb-8">Add categories and items, or remove them. Changes appear on the store right away.</p>

      {/* Add Category */}
      <section className={`${card} p-6 mb-8`}>
        <h3 className="font-bold text-brand-dk text-lg mb-5">Add Category</h3>
        <Notice msg={catMsg} />
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div className="grid grid-cols-[88px_1fr] gap-3">
            <div>
              <label className={label}>Icon</label>
              <input value={catIcon} onChange={e => setCatIcon(e.target.value)} maxLength={4} className={`${field} text-2xl text-center`} />
            </div>
            <div>
              <label className={label}>Category</label>
              <input value={catName} onChange={e => pickCategory(e.target.value)} placeholder="e.g. Bath & Body" list="category-suggestions" className={field} />
              <datalist id="category-suggestions">{categories.map(c => <option key={c.key} value={c.label} />)}</datalist>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-brand/50 mr-1">Pick one to change its image:</span>
            {categories.map(c => (
              <button key={c.key} type="button" onClick={() => pickCategory(c.label)}
                className="text-xs px-2.5 py-1 rounded-full bg-sage text-brand hover:bg-sage-dk/30 cursor-pointer">{c.icon} {c.label}</button>
            ))}
          </div>
          <div>
            <label className={label}>Category Image</label>
            <ImagePicker value={catImage} onChange={setCatImage} onError={m => setCatMsg({ text: m, ok: false })} />
          </div>
          <button disabled={busy === "cat"} className={saveBtn}>{busy === "cat" ? "Saving…" : "Save"}</button>
        </form>
      </section>

      {/* Add Item */}
      <section className={`${card} p-6 mb-8`}>
        <h3 className="font-bold text-brand-dk text-lg mb-5">Add Item</h3>
        <Notice msg={itemMsg} />
        <form onSubmit={handleSaveItem} className="space-y-4">
          <div>
            <label className={label}>Category</label>
            <select value={itemCat} onChange={e => setItemCat(e.target.value)} className={field}>
              <option value="">Select a category…</option>
              {categories.map(c => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Item Name</label>
            <input value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. Ceramic Coffee Mug" className={field} />
          </div>
          <div>
            <label className={label}>Item Images</label>
            <PhotosPicker photos={itemPhotos} onChange={setItemPhotos} onError={m => setItemMsg({ text: m, ok: false })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Price (৳)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand/50">৳</span>
                <input type="number" min={0} step="1" value={itemPrice} onChange={e => setItemPrice(e.target.value)} placeholder="e.g. 250" className={`${field} pl-8`} />
              </div>
            </div>
            <div>
              <label className={label}>Stock quantity</label>
              <input type="number" min={0} value={itemStock} onChange={e => setItemStock(e.target.value)} className={field} />
            </div>
          </div>
          <div>
            <label className={label}>Show on home page as</label>
            <TagToggles {...itemTags} onChange={setItemTags} />
          </div>
          <button disabled={busy === "item"} className={saveBtn}>{busy === "item" ? "Saving…" : "Save"}</button>
        </form>
      </section>

      {/* Remove Category or Item */}
      <section className={`${card} p-6 mb-8`}>
        <h3 className="font-bold text-brand-dk text-lg mb-5">Remove Category or Item</h3>
        <Notice msg={removeMsg} />
        <form onSubmit={handleRemove} className="space-y-4">
          <div>
            <label className={label}>What do you want to remove?</label>
            <select value={removeType} onChange={e => { setRemoveType(e.target.value as typeof removeType); setRemoveTarget(""); setRemoveMsg(null); }} className={field}>
              <option value="">Select…</option>
              <option value="category">Category</option>
              <option value="item">Item</option>
            </select>
          </div>
          {removeType && (
            <div>
              <label className={label}>{removeType === "category" ? "Category" : "Item"}</label>
              <select value={removeTarget} onChange={e => setRemoveTarget(e.target.value)} className={field}>
                <option value="">Select…</option>
                {removeType === "category"
                  ? categories.map(c => <option key={c.key} value={c.key}>{c.icon} {c.label} ({products.filter(p => p.category === c.key).length} items)</option>)
                  : products.map(p => <option key={p.id} value={p.id}>{p.name} — {categoryOf(p.category)?.label ?? "No category"}</option>)}
              </select>
              {removeType === "category" && <p className="mt-1.5 text-xs text-heart/80">Removing a category also removes all of its items.</p>}
            </div>
          )}
          <button className="py-3 px-7 rounded-xl bg-heart hover:bg-heart/90 text-white font-bold text-sm cursor-pointer">Remove</button>
        </form>
      </section>

      {/* Items added during this visit */}
      {justAdded.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-3 mb-4">
            <h3 className="font-bold text-brand-dk text-lg">Just Added ({justAdded.length})</h3>
            <Link href="/admin/products" className="text-sm font-semibold text-brand/70 hover:text-brand underline">See all {products.length} items →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {justAdded.map(p => (
              <div key={p.id} className={`${card} overflow-hidden`}>
                <div className="relative w-full h-32 bg-sage flex items-center justify-center overflow-hidden">
                  <ProductImage product={p} className="text-5xl" />
                  {photosOf(p).length > 1 && <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold">📷 {photosOf(p).length}</span>}
                </div>
                <div className="p-3">
                  <p className="text-xs text-gold-dk font-semibold truncate">{categoryOf(p.category)?.label ?? "No category"}</p>
                  <p className="font-semibold text-brand-dk text-sm truncate">{p.name}</p>
                  <p className="text-brand font-bold text-sm mt-1">{formatTk(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
