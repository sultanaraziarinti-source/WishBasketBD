"use client";
import { createContext, useContext, ReactNode } from "react";
import { useStoredState } from "@/lib/useStoredState";

interface WishlistContextType {
  ids: number[];
  has: (id: number) => boolean;
  toggle: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({} as WishlistContextType);
const EMPTY: number[] = [];

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useStoredState("wb_wishlist", EMPTY);

  const has = (id: number) => ids.includes(id);

  // Returns true when the item is now in the wishlist
  const toggle = (id: number) => {
    const adding = !ids.includes(id);
    setIds(cur => adding ? [...cur, id] : cur.filter(x => x !== id));
    return adding;
  };

  return <WishlistContext.Provider value={{ ids, has, toggle }}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
