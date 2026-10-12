import { Category, OrderStatus, Product, Settings } from "./types";

// Seed data — the admin panel edits copies of these stored in the browser
export const SEED_CATEGORIES: Category[] = [
  { key: "home",    label: "Home Essentials",  icon: "🏠", blurb: "Everyday comfort for every corner of your home." },
  { key: "kitchen", label: "Kitchen & Dining", icon: "🍳", blurb: "Cook, serve and enjoy with tools you'll love." },
  { key: "decor",   label: "Decor & Crafts",   icon: "✨", blurb: "Style your space with handpicked pieces." },
  { key: "kids",    label: "Kids & Toys",      icon: "🧸", blurb: "Safe, fun toys that help little ones learn." },
  { key: "gifts",   label: "Gifts & Hampers",  icon: "🎁", blurb: "Made to make smiles — for every occasion." },
  { key: "plants",  label: "Plants & Garden",  icon: "🪴", blurb: "Bring nature home with easy-care greens." },
];

export const SEED_PRODUCTS: Product[] = [
  { id: 1,  name: "Cotton Bedsheet Set (King)",  category: "home",    emoji: "🛏️", price: 1450, oldPrice: 1800, featured: true, stock: 12, rating: 4.8 },
  { id: 2,  name: "Woven Storage Basket",        category: "home",    emoji: "🧺", price: 890,  oldPrice: null, newArrival: true, stock: 18, rating: 4.6 },
  { id: 3,  name: "Ceramic Soap Dispenser",      category: "home",    emoji: "🧴", price: 450,  oldPrice: 550,   stock: 25, rating: 4.4 },
  { id: 4,  name: "Microfiber Towel Pack (3pc)", category: "home",    emoji: "🧻", price: 620,  oldPrice: null,  stock: 9,  rating: 4.5 },
  { id: 5,  name: "Handmade Jute Doormat",       category: "home",    emoji: "🟫", price: 380,  oldPrice: 450,   stock: 0,  rating: 4.3 },

  { id: 6,  name: "Ceramic Coffee Mug",          category: "kitchen", emoji: "☕", price: 350,  oldPrice: 420,  featured: true, stock: 40, rating: 4.9 },
  { id: 7,  name: "Wooden Cutting Board",        category: "kitchen", emoji: "🪵", price: 690,  oldPrice: null,  stock: 14, rating: 4.5 },
  { id: 8,  name: "Glass Storage Jar Set",       category: "kitchen", emoji: "🫙", price: 980,  oldPrice: 1200,  stock: 7,  rating: 4.6 },
  { id: 9,  name: "Stainless Steel Kettle",      category: "kitchen", emoji: "🫖", price: 1850, oldPrice: 2200, featured: true, stock: 5,  rating: 4.7 },
  { id: 10, name: "Bamboo Cutlery Set",          category: "kitchen", emoji: "🍴", price: 540,  oldPrice: null, newArrival: true, stock: 22, rating: 4.4 },

  { id: 11, name: "Scented Candle Set",          category: "decor",   emoji: "🕯️", price: 750,  oldPrice: 900,  featured: true, stock: 16, rating: 4.8 },
  { id: 12, name: "Ceramic Flower Vase",         category: "decor",   emoji: "🏺", price: 1150, oldPrice: null,  stock: 6,  rating: 4.6 },
  { id: 13, name: "Warm Fairy String Lights",    category: "decor",   emoji: "💡", price: 490,  oldPrice: null, newArrival: true, stock: 30, rating: 4.5 },
  { id: 14, name: "Macramé Wall Hanging",        category: "decor",   emoji: "🪢", price: 820,  oldPrice: 990,   stock: 4,  rating: 4.7 },
  { id: 15, name: "Wooden Photo Frame Set",      category: "decor",   emoji: "🖼️", price: 960,  oldPrice: null,  stock: 11, rating: 4.4 },

  { id: 16, name: "Building Blocks Set",         category: "kids",    emoji: "🧱", price: 1250, oldPrice: 1500, featured: true, stock: 10, rating: 4.8 },
  { id: 17, name: "Plush Teddy Bear",            category: "kids",    emoji: "🧸", price: 890,  oldPrice: null,  stock: 15, rating: 4.9 },
  { id: 18, name: "Wooden Jigsaw Puzzle",        category: "kids",    emoji: "🧩", price: 450,  oldPrice: null, newArrival: true, stock: 20, rating: 4.5 },
  { id: 19, name: "Crayon Box (64 Colors)",      category: "kids",    emoji: "🖍️", price: 380,  oldPrice: 450,   stock: 0,  rating: 4.6 },
  { id: 20, name: "Kids Story Book Set",         category: "kids",    emoji: "📚", price: 650,  oldPrice: 780,   stock: 8,  rating: 4.7 },

  { id: 21, name: "Wish Gift Hamper Basket",     category: "gifts",   emoji: "🎁", price: 2490, oldPrice: 2990, featured: true, stock: 6,  rating: 5.0 },
  { id: 22, name: "Couple Mug Set",              category: "gifts",   emoji: "💑", price: 750,  oldPrice: null,  stock: 12, rating: 4.6 },
  { id: 23, name: "Greeting Card Pack",          category: "gifts",   emoji: "💌", price: 250,  oldPrice: null, newArrival: true, stock: 50, rating: 4.3 },
  { id: 24, name: "Personalised Keychain",       category: "gifts",   emoji: "🔑", price: 300,  oldPrice: 350,   stock: 35, rating: 4.4 },
  { id: 25, name: "Chocolate Gift Box",          category: "gifts",   emoji: "🍫", price: 1200, oldPrice: 1400,  stock: 9,  rating: 4.8 },

  { id: 26, name: "Snake Plant (Indoor)",        category: "plants",  emoji: "🌿", price: 650,  oldPrice: null, featured: true, stock: 13, rating: 4.7 },
  { id: 27, name: "Succulent Trio",              category: "plants",  emoji: "🌵", price: 550,  oldPrice: 650,   stock: 17, rating: 4.6 },
  { id: 28, name: "Ceramic Planter Pot",         category: "plants",  emoji: "🪴", price: 480,  oldPrice: null, newArrival: true, stock: 21, rating: 4.5 },
  { id: 29, name: "Money Plant in Glass",        category: "plants",  emoji: "🍀", price: 390,  oldPrice: null,  stock: 3,  rating: 4.4 },
  { id: 30, name: "Mini Garden Tool Kit",        category: "plants",  emoji: "🧤", price: 990,  oldPrice: 1150,  stock: 7,  rating: 4.5 },
];

export const DEFAULT_SETTINGS: Settings = {
  announcement: "All over Bangladesh delivery · Free delivery on orders over ৳2,000",
  hotline: "01XXX-XXXXXX",
  email: "hello@wishbasketbd.com",
  address: "Dhaka, Bangladesh",
  deliveryInside: 60,
  deliveryOutside: 120,
  freeDeliveryAt: 2000,
};

export const ORDER_STATUSES: { key: OrderStatus; label: string; cls: string }[] = [
  { key: "pending",   label: "Pending",   cls: "bg-gold-lt text-gold-dk" },
  { key: "confirmed", label: "Confirmed", cls: "bg-sage text-brand" },
  { key: "shipped",   label: "Shipped",   cls: "bg-sky-100 text-sky-800" },
  { key: "delivered", label: "Delivered", cls: "bg-brand text-cream" },
  { key: "cancelled", label: "Cancelled", cls: "bg-heart/10 text-heart" },
];

export const statusOf = (s: OrderStatus) => ORDER_STATUSES.find(x => x.key === s)!;

export const formatTk = (n: number) => `৳${n.toLocaleString("en-IN")}`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const discountPct = (p: Product) =>
  p.oldPrice && p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

export const tintFor = (i: number) => (i % 2 ? "bg-gold-lt" : "bg-sage");

export const slugify = (s: string) => s.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const describe = (p: Product, categoryLabel = "") =>
  p.description?.trim() ||
  `${p.name} — a handpicked ${categoryLabel ? categoryLabel.toLowerCase() + " " : ""}favourite from Wish Basket BD. Quality you love at a price you'll adore, carefully packed and delivered to your doorstep anywhere in Bangladesh.`;

// All photos of a product, main photo first
export const photosOf = (p: Pick<Product, "image" | "images">) => [p.image, ...(p.images ?? [])].filter((x): x is string => !!x);

// Tag checks that also understand products saved before tags became two separate switches
export const isFeatured = (p: Pick<Product, "featured" | "badge">) => p.featured ?? p.badge === "hot";
export const isNew = (p: Pick<Product, "newArrival" | "badge">) => p.newArrival ?? p.badge === "new";
