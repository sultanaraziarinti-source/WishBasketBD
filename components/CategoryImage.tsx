import { Category } from "@/lib/types";

// Category photo when the admin uploaded one, otherwise its emoji icon
export default function CategoryImage({ category: c, className = "text-5xl" }: { category: Category; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- admin uploads are data URLs
  if (c.image) return <img src={c.image} alt={c.label} className="w-full h-full object-cover" />;
  return <span className={className}>{c.icon}</span>;
}
