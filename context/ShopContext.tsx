"use client";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { Category, ContactMessage, Order, OrderStatus, Product, Settings, StoredUser } from "@/lib/types";
import { DEFAULT_SETTINGS, SEED_CATEGORIES, SEED_PRODUCTS, slugify } from "@/lib/products";
import { useStoredState } from "@/lib/useStoredState";
import { supabaseEnabled } from "@/lib/supabase";
import * as api from "@/lib/db";
import { useAdmin } from "./AdminContext";
import { useAuth } from "./AuthContext";

type Result<T> = Promise<{ ok: true; value: T } | { ok: false; error: string }>;

interface ShopContextType {
  /** True once the catalogue has loaded (always true in browser-storage mode). */
  ready: boolean;
  /** Set when Supabase couldn't be reached. */
  loadError: string | null;

  products: Product[];
  categories: Category[];
  orders: Order[];
  users: StoredUser[];
  messages: ContactMessage[];
  settings: Settings;
  myOrderIds: string[];

  productById: (id: number) => Product | undefined;
  categoryOf: (key: string) => Category | undefined;

  saveProduct: (p: Omit<Product, "id"> & { id?: number }) => Result<number>;
  deleteProduct: (id: number) => Result<null>;

  saveCategory: (c: Omit<Category, "key"> & { key?: string }) => Result<string>;
  deleteCategory: (key: string, withProducts?: boolean) => Result<null>;

  /** Resolves to the order id, or an error ("OUT_OF_STOCK" when an item sold out). */
  placeOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => Result<string>;
  setOrderStatus: (id: string, status: OrderStatus) => Result<null>;

  saveSettings: (s: Settings) => Result<null>;

  sendMessage: (m: { name: string; phone: string; message: string }) => Result<null>;
  setMessageRead: (id: number, read: boolean) => Result<null>;
  deleteMessage: (id: number) => Result<null>;
}

const ShopContext = createContext<ShopContextType>({} as ShopContextType);
const NO_ORDERS: Order[] = [];
const NO_USERS: StoredUser[] = [];
const NO_IDS: string[] = [];
const NO_MESSAGES: ContactMessage[] = [];

const fail = (e: unknown) => ({ ok: false as const, error: e instanceof Error ? e.message : String(e) });
const done = <T,>(value: T) => ({ ok: true as const, value });

export function ShopProvider({ children }: { children: ReactNode }) {
  const { admin } = useAdmin();
  const { user } = useAuth();

  // ----- browser-storage state (used when Supabase isn't configured) -----
  const [lProducts, setLProducts] = useStoredState("wb_products", SEED_PRODUCTS);
  const [lCategories, setLCategories] = useStoredState("wb_categories", SEED_CATEGORIES);
  const [lOrders, setLOrders] = useStoredState("wb_orders", NO_ORDERS);
  const [lUsers] = useStoredState("wb_users", NO_USERS);
  const [lSettings, setLSettings] = useStoredState("wb_settings", DEFAULT_SETTINGS);
  const [lMessages, setLMessages] = useStoredState("wb_messages", NO_MESSAGES);
  // Orders placed from this device (both modes) — lets guests see their orders
  const [myOrderIds, setMyOrderIds] = useStoredState("wb_my_orders", NO_IDS);

  // ----- Supabase state -----
  const [sProducts, setSProducts] = useState<Product[]>([]);
  const [sCategories, setSCategories] = useState<Category[]>([]);
  const [sSettings, setSSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [sOrders, setSOrders] = useState<Order[]>([]);
  const [sUsers, setSUsers] = useState<StoredUser[]>([]);
  const [sMessages, setSMessages] = useState<ContactMessage[]>([]);
  const [ready, setReady] = useState(!supabaseEnabled);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ----- loading (fetch first, then apply — state is only set after the request finishes) -----
  const applyCatalog = useCallback((r: Awaited<ReturnType<typeof api.loadCatalog>> | Error) => {
    if (r instanceof Error) setLoadError(r.message);
    else { setSProducts(r.products); setSCategories(r.categories); setSSettings(r.settings); setLoadError(null); }
    setReady(true);
  }, []);
  const fetchCatalog = () => api.loadCatalog().catch((e: unknown) => (e instanceof Error ? e : new Error(String(e))));

  // Orders: everything for an admin; otherwise the customer's own + those placed on this device
  const fetchOrders = useCallback(async () => {
    if (admin) return api.loadAllOrders();
    const [mine, device] = await Promise.all([user ? api.loadMyOrders() : Promise.resolve([]), api.loadOrdersByIds(myOrderIds)]);
    const byId = new Map([...device, ...mine].map(o => [o.id, o]));
    return [...byId.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [admin, user, myOrderIds]);

  const reloadCatalog = useCallback(async () => applyCatalog(await fetchCatalog()), [applyCatalog]);
  const reloadOrders = useCallback(async () => { try { setSOrders(await fetchOrders()); } catch { /* keep what we have */ } }, [fetchOrders]);

  // Load now, then keep fresh without a manual reload: every 20s while the tab is visible,
  // and right away when the visitor switches back to the tab
  useEffect(() => {
    if (!supabaseEnabled) return;
    let live = true;
    const refresh = () => {
      if (document.visibilityState === "hidden") return;
      fetchCatalog().then(r => { if (live) applyCatalog(r); });
      fetchOrders().then(o => { if (live) setSOrders(o); }).catch(() => {});
      if (admin) {
        Promise.all([api.loadCustomers(), api.loadMessages()])
          .then(([u, m]) => { if (live) { setSUsers(u); setSMessages(m); } })
          .catch(() => {});
      }
    };
    refresh();
    const timer = setInterval(refresh, 20_000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      live = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [applyCatalog, fetchOrders, admin]);

  const products = supabaseEnabled ? sProducts : lProducts;
  const categories = supabaseEnabled ? sCategories : lCategories;

  const productById = (id: number) => products.find(p => p.id === id);
  const categoryOf = (key: string) => categories.find(c => c.key === key);

  // ----- products -----
  const saveProduct: ShopContextType["saveProduct"] = async p => {
    if (supabaseEnabled) {
      try {
        const saved = await api.saveProduct(p);
        setSProducts(list => p.id ? list.map(x => x.id === saved.id ? saved : x) : [saved, ...list]);
        return done(saved.id);
      } catch (e) { return fail(e); }
    }
    const id = p.id ?? Math.max(0, ...lProducts.map(x => x.id)) + 1;
    const ok = setLProducts(list => p.id ? list.map(x => x.id === id ? { ...p, id } : x) : [{ ...p, id }, ...list]);
    return ok ? done(id) : fail("Browser storage is full — try a smaller image.");
  };

  const deleteProduct: ShopContextType["deleteProduct"] = async id => {
    if (supabaseEnabled) {
      try { await api.deleteProduct(id); setSProducts(list => list.filter(x => x.id !== id)); return done(null); }
      catch (e) { return fail(e); }
    }
    setLProducts(list => list.filter(x => x.id !== id));
    return done(null);
  };

  // ----- categories -----
  const saveCategory: ShopContextType["saveCategory"] = async c => {
    const isNew = !c.key;
    const key = c.key ?? slugify(c.label);
    if (!key) return fail("Please enter a category name.");
    if (isNew && categories.some(x => x.key === key)) return fail("A category with this name already exists.");
    const cat: Category = { ...c, key };
    if (supabaseEnabled) {
      try {
        const saved = await api.saveCategory(cat, isNew);
        setSCategories(list => isNew ? [...list, saved] : list.map(x => x.key === key ? saved : x));
        return done(key);
      } catch (e) { return fail(e); }
    }
    setLCategories(list => isNew ? [...list, cat] : list.map(x => x.key === key ? cat : x));
    return done(key);
  };

  // Refuses while the category still has products, unless withProducts removes them too
  const deleteCategory: ShopContextType["deleteCategory"] = async (key, withProducts = false) => {
    const count = products.filter(p => p.category === key).length;
    if (count && !withProducts) return fail(`Move or delete its ${count} product(s) first.`);
    if (supabaseEnabled) {
      try {
        await api.deleteCategory(key);
        setSCategories(list => list.filter(x => x.key !== key));
        setSProducts(list => list.filter(p => p.category !== key));
        return done(null);
      } catch (e) { return fail(e); }
    }
    if (count) setLProducts(list => list.filter(p => p.category !== key));
    setLCategories(list => list.filter(x => x.key !== key));
    return done(null);
  };

  // ----- orders -----
  const placeOrder: ShopContextType["placeOrder"] = async o => {
    if (supabaseEnabled) {
      try {
        const id = await api.placeOrder(o);
        if (!id) return fail("OUT_OF_STOCK");
        setMyOrderIds(ids => [id, ...ids]);
        await Promise.all([reloadCatalog(), api.loadOrdersByIds([id]).then(([order]) => order && setSOrders(list => [order, ...list]))]);
        return done(id);
      } catch (e) { return fail(e); }
    }
    if (o.items.some(i => (productById(i.id)?.stock ?? 0) < i.qty)) return fail("OUT_OF_STOCK");
    const id = `WB${Date.now().toString(36).toUpperCase()}`;
    setLOrders(list => [{ ...o, id, createdAt: new Date().toISOString(), status: "pending" }, ...list]);
    setLProducts(list => list.map(p => {
      const item = o.items.find(i => i.id === p.id);
      return item ? { ...p, stock: p.stock - item.qty } : p;
    }));
    setMyOrderIds(ids => [id, ...ids]);
    return done(id);
  };

  // Cancelling returns the items to stock; a cancelled order is final
  const setOrderStatus: ShopContextType["setOrderStatus"] = async (id, status) => {
    if (supabaseEnabled) {
      try { await api.setOrderStatus(id, status); await Promise.all([reloadOrders(), reloadCatalog()]); return done(null); }
      catch (e) { return fail(e); }
    }
    const order = lOrders.find(o => o.id === id);
    if (!order || order.status === "cancelled" || order.status === status) return done(null);
    setLOrders(list => list.map(o => o.id === id ? { ...o, status } : o));
    if (status === "cancelled") {
      setLProducts(list => list.map(p => {
        const item = order.items.find(i => i.id === p.id);
        return item ? { ...p, stock: p.stock + item.qty } : p;
      }));
    }
    return done(null);
  };

  // ----- settings -----
  const saveSettings: ShopContextType["saveSettings"] = async s => {
    if (supabaseEnabled) {
      try { await api.saveSettings(s); setSSettings(s); return done(null); }
      catch (e) { return fail(e); }
    }
    setLSettings(s);
    return done(null);
  };

  // ----- contact messages -----
  const sendMessage: ShopContextType["sendMessage"] = async m => {
    if (supabaseEnabled) {
      try { await api.sendMessage(m); return done(null); }
      catch (e) { return fail(e); }
    }
    setLMessages(list => [{ ...m, id: Date.now(), createdAt: new Date().toISOString() }, ...list]);
    return done(null);
  };

  const setMessageRead: ShopContextType["setMessageRead"] = async (id, read) => {
    if (supabaseEnabled) {
      try { await api.setMessageRead(id, read); setSMessages(list => list.map(m => m.id === id ? { ...m, read } : m)); return done(null); }
      catch (e) { return fail(e); }
    }
    setLMessages(list => list.map(m => m.id === id ? { ...m, read } : m));
    return done(null);
  };

  const deleteMessage: ShopContextType["deleteMessage"] = async id => {
    if (supabaseEnabled) {
      try { await api.deleteMessage(id); setSMessages(list => list.filter(m => m.id !== id)); return done(null); }
      catch (e) { return fail(e); }
    }
    setLMessages(list => list.filter(m => m.id !== id));
    return done(null);
  };

  return (
    <ShopContext.Provider value={{
      ready, loadError,
      products, categories,
      orders: supabaseEnabled ? sOrders : lOrders,
      users: supabaseEnabled ? (admin ? sUsers : []) : lUsers,
      messages: supabaseEnabled ? (admin ? sMessages : []) : lMessages,
      settings: supabaseEnabled ? sSettings : lSettings,
      myOrderIds,
      productById, categoryOf, saveProduct, deleteProduct, saveCategory, deleteCategory,
      placeOrder, setOrderStatus, saveSettings, sendMessage, setMessageRead, deleteMessage,
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
