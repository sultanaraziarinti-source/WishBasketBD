"use client";
import { useState } from "react";
import { Product } from "@/lib/types";
import { photosOf } from "@/lib/products";

// Large photo with clickable thumbnails underneath (only when there's more than one photo)
export default function ProductGallery({ product: p, dim = false }: { product: Product; dim?: boolean }) {
  const photos = photosOf(p);
  const [active, setActive] = useState(0);
  const current = photos[Math.min(active, photos.length - 1)];
  const fade = dim ? "grayscale opacity-60" : "";

  const go = (d: number) => setActive(i => (i + d + photos.length) % photos.length);

  return (
    <div>
      <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-sage to-cream border border-sage flex items-center justify-center overflow-hidden">
        {current
          // eslint-disable-next-line @next/next/no-img-element -- admin uploads are data URLs
          ? <img src={current} alt={p.name} className={`w-full h-full object-cover ${fade}`} />
          : <span className={`text-[140px] md:text-[200px] ${fade}`}>{p.emoji}</span>}

        {photos.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-brand text-xl shadow cursor-pointer">‹</button>
            <button onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-brand text-xl shadow cursor-pointer">›</button>
            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/55 text-white text-xs font-semibold">{Math.min(active, photos.length - 1) + 1} / {photos.length}</span>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 gap-2">
          {photos.map((src, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`}
              className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer ${i === active ? "border-brand" : "border-sage opacity-70 hover:opacity-100"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- admin uploads are data URLs */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
