"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, Product } from "@/lib/types";
import { useStoredState } from "@/lib/useStoredState";
import { useShop } from "./ShopContext";

const EMPTY: CartItem[] = [];

interface CartContextType {
  cart: CartItem[];
  addToCart: (p: Product, qty?: number) => boolean;
  removeFromCart: (id: number) => void;
  changeQty: (id: number, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const { productById } = useShop();
  const [stored, setCart] = useStoredState("wb_cart", EMPTY);
  const [isOpen, setIsOpen] = useState(false);

  // Keep cart lines in sync with the live catalogue (price/stock edits, deleted products)
  const cart = stored.flatMap(item => {
    const p = productById(item.id);
    return p ? [{ ...p, qty: Math.min(item.qty, Math.max(p.stock, 0)) }] : [];
  }).filter(i => i.qty > 0);

  const stockOf = (id: number) => productById(id)?.stock ?? 0;

  // Returns false when the product is out of stock or the cart already holds all of it
  const addToCart = (p: Product, qty = 1) => {
    const inCart = cart.find(x => x.id === p.id)?.qty ?? 0;
    if (inCart + qty > stockOf(p.id)) return false;
    setCart(c => c.some(x => x.id === p.id) ? c.map(x => x.id === p.id ? { ...x, qty: inCart + qty } : x) : [...c, { ...p, qty }]);
    return true;
  };

  const removeFromCart = (id: number) => setCart(c => c.filter(x => x.id !== id));

  const changeQty = (id: number, delta: number) =>
    setCart(c => c
      .map(x => x.id === id ? { ...x, qty: Math.min(x.qty + delta, stockOf(id)) } : x)
      .filter(x => x.qty > 0));

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQty, clearCart, cartCount, cartTotal, isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false) }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
