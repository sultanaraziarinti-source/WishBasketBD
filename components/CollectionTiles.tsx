import Link from "next/link";
import { Category } from "@/lib/types";

// Masonry layout like chalkpencil: each block of 6 categories fills a 3-column grid of 80px row units
const SLOTS = [
  { c: 1, r: 1, s: 4 }, { c: 2, r: 1, s: 6 }, { c: 3, r: 1, s: 5 },
  { c: 1, r: 5, s: 5 }, { c: 3, r: 6, s: 4 }, { c: 2, r: 7, s: 3 },
];
const BLOCK_ROWS = 9;

// Background for categories without an uploaded image
const FILLS = [
  "from-brand to-brand-dk",
  "from-gold to-gold-dk",
  "from-sage-dk to-brand",
  "from-gold-dk to-brand-dk",
  "from-brand-dk to-sage-dk",
  "from-sage-dk to-gold-dk",
];

function Tile({ category: c, index, className = "", style }: { category: Category; index: number; className?: string; style?: React.CSSProperties }) {
  return (
    <Link href={`/category/${c.key}`} style={style} className={`relative block overflow-hidden rounded-3xl bg-gradient-to-br ${FILLS[index % FILLS.length]} ${className}`}>
      {c.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin uploads are data URLs
        <img src={c.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center pb-12 text-[88px] md:text-[130px]">{c.icon}</span>
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <h3 className="absolute left-5 right-5 bottom-5 md:left-9 md:bottom-9 text-xl md:text-3xl font-extrabold text-white leading-tight drop-shadow">{c.label}</h3>
    </Link>
  );
}

export default function CollectionTiles({ categories }: { categories: Category[] }) {
  const full = categories.length - (categories.length % SLOTS.length);
  const rest = categories.slice(full);

  return (
    <>
      {full > 0 && (
        <div className="grid grid-cols-2 gap-3 md:gap-6 md:grid-cols-[1fr_1fr_1.6fr] md:auto-rows-[80px]">
          {categories.slice(0, full).map((c, i) => {
            const s = SLOTS[i % SLOTS.length];
            const row = s.r + Math.floor(i / SLOTS.length) * BLOCK_ROWS;
            return (
              <Tile key={c.key} category={c} index={i}
                style={{ "--c": s.c, "--r": row, "--s": s.s } as React.CSSProperties}
                className="aspect-[4/5] md:aspect-auto md:[grid-column:var(--c)] md:[grid-row:var(--r)/span_var(--s)]" />
            );
          })}
        </div>
      )}
      {rest.length > 0 && (
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 ${full > 0 ? "mt-3 md:mt-6" : ""}`}>
          {rest.map((c, i) => <Tile key={c.key} category={c} index={full + i} className="aspect-[4/5] md:aspect-[4/3]" />)}
        </div>
      )}
    </>
  );
}
