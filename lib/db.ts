// Supabase data access. Maps between database rows (snake_case) and the app's types.
import { supabase, supabaseAdmin, uploadPhoto } from "./supabase";
import { Category, ContactMessage, Order, OrderStatus, Product, Settings, StoredUser } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any -- rows come back untyped from supabase-js */
// Shopper connection (public reads, orders, messages, customer's own data)
const db = () => {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
};
// Admin connection (everything that needs the admin to be signed in)
const adm = () => {
  if (!supabaseAdmin) throw new Error("Supabase is not configured");
  return supabaseAdmin;
};

// Throws on error; returns the rows (never null)
const check = <T>({ data, error }: { data: T | null; error: { message: string } | null }): T => {
  if (error) throw new Error(error.message);
  return (data ?? []) as T;
};
const rows = (r: { data: any[] | null; error: { message: string } | null }) => check<any[]>(r);

// ---------- mapping ----------

export const toCategory = (r: any): Category => ({ key: r.key, label: r.label, icon: r.icon, blurb: r.blurb ?? "", image: r.image ?? undefined });

export const toProduct = (r: any): Product => ({
  id: Number(r.id), name: r.name, category: r.category ?? "", emoji: r.emoji, image: r.image ?? undefined, images: r.images ?? [],
  description: r.description ?? undefined, price: Number(r.price), oldPrice: r.old_price == null ? null : Number(r.old_price),
  featured: r.featured, newArrival: r.new_arrival, stock: r.stock, rating: Number(r.rating),
});

const fromProduct = (p: Omit<Product, "id">) => ({
  name: p.name, category: p.category || null, emoji: p.emoji, image: p.image ?? null, images: p.images ?? [],
  description: p.description || null, price: p.price, old_price: p.oldPrice, featured: !!p.featured, new_arrival: !!p.newArrival,
  stock: p.stock, rating: p.rating,
});

export const toOrder = (r: any): Order => ({
  id: r.id, createdAt: r.created_at, items: r.items, subtotal: Number(r.subtotal), delivery: Number(r.delivery), total: Number(r.total),
  status: r.status, payment: r.payment, userEmail: r.user_email ?? undefined, customer: r.customer,
});

export const toSettings = (r: any): Settings => ({
  announcement: r.announcement, hotline: r.hotline, email: r.email, address: r.address,
  deliveryInside: Number(r.delivery_inside), deliveryOutside: Number(r.delivery_outside), freeDeliveryAt: Number(r.free_delivery_at),
});

export const toMessage = (r: any): ContactMessage => ({ id: Number(r.id), name: r.name, phone: r.phone, message: r.message, createdAt: r.created_at, read: r.read });

export const toCustomer = (r: any): StoredUser => ({ firstName: r.first_name ?? "", lastName: r.last_name ?? "", email: r.email ?? "", password: "", createdAt: r.created_at });

// ---------- reads ----------

export async function loadCatalog() {
  const [cats, prods, set] = await Promise.all([
    db().from("categories").select("*").order("sort").order("created_at"),
    db().from("products").select("*").order("created_at", { ascending: false }),
    db().from("settings").select("*").eq("id", 1).single(),
  ]);
  return { categories: rows(cats).map(toCategory), products: rows(prods).map(toProduct), settings: toSettings(check(set)) };
}

/** Orders of the signed-in customer. */
export async function loadMyOrders() {
  return rows(await db().from("orders").select("*").order("created_at", { ascending: false })).map(toOrder);
}

/** Every order (admin only). */
export async function loadAllOrders() {
  return rows(await adm().from("orders").select("*").order("created_at", { ascending: false })).map(toOrder);
}

/** Orders placed from this device, looked up by id (works for guests). */
export async function loadOrdersByIds(ids: string[]) {
  if (!ids.length) return [];
  return rows(await db().rpc("get_orders_by_ids", { p_ids: ids })).map(toOrder);
}

export async function loadCustomers() {
  return rows(await adm().from("profiles").select("*").eq("is_admin", false).order("created_at", { ascending: false })).map(toCustomer);
}

export async function loadMessages() {
  return rows(await adm().from("messages").select("*").order("created_at", { ascending: false })).map(toMessage);
}

// ---------- writes ----------

async function uploadAll(p: Omit<Product, "id">) {
  const image = p.image ? await uploadPhoto(p.image) : undefined;
  const images = await Promise.all((p.images ?? []).map(uploadPhoto));
  return { ...p, image, images };
}

export async function saveProduct(p: Omit<Product, "id"> & { id?: number }): Promise<Product> {
  const row = fromProduct(await uploadAll(p));
  const q = p.id ? adm().from("products").update(row).eq("id", p.id) : adm().from("products").insert(row);
  return toProduct(check(await q.select().single()));
}

export async function deleteProduct(id: number) {
  check(await adm().from("products").delete().eq("id", id));
}

export async function saveCategory(c: Category, isNew: boolean): Promise<Category> {
  const row = { key: c.key, label: c.label, icon: c.icon, blurb: c.blurb, image: c.image ? await uploadPhoto(c.image) : null };
  const q = isNew ? adm().from("categories").insert(row) : adm().from("categories").update(row).eq("key", c.key);
  return toCategory(check(await q.select().single()));
}

/** Deleting a category also deletes its products (foreign key cascade). */
export async function deleteCategory(key: string) {
  check(await adm().from("categories").delete().eq("key", key));
}

export async function placeOrder(o: Omit<Order, "id" | "createdAt" | "status">): Promise<string | null> {
  const { data, error } = await db().rpc("place_order", {
    p_items: o.items.map(i => ({ id: i.id, qty: i.qty })), p_payment: o.payment, p_customer: o.customer,
  });
  if (error) {
    if (error.message.includes("OUT_OF_STOCK")) return null;
    throw new Error(error.message);
  }
  return data as string;
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  check(await adm().rpc("set_order_status", { p_id: id, p_status: status }));
}

export async function saveSettings(s: Settings) {
  check(await adm().from("settings").update({
    announcement: s.announcement, hotline: s.hotline, email: s.email, address: s.address,
    delivery_inside: s.deliveryInside, delivery_outside: s.deliveryOutside, free_delivery_at: s.freeDeliveryAt,
  }).eq("id", 1));
}

export async function sendMessage(m: { name: string; phone: string; message: string }) {
  check(await db().from("messages").insert(m));
}

export async function setMessageRead(id: number, read: boolean) {
  check(await adm().from("messages").update({ read }).eq("id", id));
}

export async function deleteMessage(id: number) {
  check(await adm().from("messages").delete().eq("id", id));
}

// ---------- admin auth ----------

/** Signs in on the admin connection and confirms the account is an admin. Resolves to an error message or null. */
export async function adminSignIn(email: string, password: string): Promise<string | null> {
  const { data, error } = await adm().auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    if (error?.code === "email_not_confirmed") return "This admin email isn't confirmed yet. In Supabase → Authentication → Users, open the user and confirm the email.";
    return "Invalid admin email or password.";
  }
  const { data: profile } = await adm().from("profiles").select("is_admin").eq("id", data.user.id).maybeSingle();
  if (!profile?.is_admin) {
    await adm().auth.signOut();
    return "This account isn't an admin yet. In Supabase SQL Editor, run the make-admin command (see supabase/SETUP.md).";
  }
  return null;
}

export async function adminSignOut() {
  await adm().auth.signOut();
}

/** Re-checks the current password, then sets a new one for the signed-in admin. */
export async function adminChangePassword(email: string, current: string, next: string): Promise<string | null> {
  const { error: authErr } = await adm().auth.signInWithPassword({ email, password: current });
  if (authErr) return "Current password is incorrect.";
  const { error } = await adm().auth.updateUser({ password: next });
  return error ? error.message : null;
}
