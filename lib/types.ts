export interface Category {
  key: string;
  label: string;
  icon: string;
  blurb: string;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  emoji: string;
  /** Main photo (shown on cards, cart and orders) */
  image?: string;
  /** Extra photos, shown in the gallery on the product page */
  images?: string[];
  description?: string;
  price: number;
  oldPrice: number | null;
  /** Shown in "Our Featured Products" on the home page */
  featured?: boolean;
  /** Shown in "New Arrivals" on the home page, with a NEW badge */
  newArrival?: boolean;
  /** @deprecated older single tag — read through isFeatured / isNew */
  badge?: "hot" | "new" | null;
  stock: number;
  rating: number;
}

export interface CartItem extends Product {
  qty: number;
}

export interface User {
  name: string;
  email: string;
  initials: string;
}

export interface StoredUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: string;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  id: number;
  name: string;
  emoji: string;
  image?: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  status: OrderStatus;
  payment: "cod" | "bkash";
  userEmail?: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    area: "inside" | "outside";
    note?: string;
  };
}

export interface Settings {
  announcement: string;
  hotline: string;
  email: string;
  address: string;
  deliveryInside: number;
  deliveryOutside: number;
  freeDeliveryAt: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  read?: boolean;
}
