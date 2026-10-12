import { Product } from "@/lib/types";

// Shows the uploaded photo when there is one, otherwise the product emoji
export default function ProductImage({ product: p, className = "text-6xl", dim = false }: { product: Pick<Product, "name" | "emoji" | "image">; className?: string; dim?: boolean }) {
  if (p.image) {
    // eslint-disable-next-line @next/next/no-img-element -- admin uploads are data URLs, not optimisable by next/image
    return <img src={p.image} alt={p.name} className={`w-full h-full object-cover ${dim ? "grayscale opacity-60" : ""}`} />;
  }
  return <span className={`${className} ${dim ? "grayscale opacity-60" : ""}`}>{p.emoji}</span>;
}
