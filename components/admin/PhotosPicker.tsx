"use client";
import { resizeImage } from "@/lib/resizeImage";

export const MAX_PHOTOS = 6;

interface Props {
  photos: string[];
  onChange: (photos: string[]) => void;
  onError: (msg: string) => void;
}

// Pick several photos at once; first photo is the main one. Reorder by "Make main", remove with ✕.
export default function PhotosPicker({ photos, onChange, onError }: Props) {
  const add = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) return onError(`You can add up to ${MAX_PHOTOS} photos.`);
    const images = files.filter(f => f.type.startsWith("image/"));
    if (images.length < files.length) onError("Some files were skipped because they aren't images.");
    try {
      const added = await Promise.all(images.slice(0, room).map(f => resizeImage(f, 800)));
      onChange([...photos, ...added]);
      if (images.length > room) onError(`Only ${room} more photo(s) fit — the limit is ${MAX_PHOTOS}.`);
    } catch {
      onError("Couldn't read one of those images. Try JPG or PNG.");
    }
  };

  const remove = (i: number) => onChange(photos.filter((_, j) => j !== i));
  const makeMain = (i: number) => onChange([photos[i], ...photos.filter((_, j) => j !== i)]);

  return (
    <div>
      {photos.length > 0 && (
        <div className="mb-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
          {photos.map((src, i) => (
            <div key={i} className={`relative aspect-square rounded-xl overflow-hidden border-2 ${i === 0 ? "border-gold" : "border-sage"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- data URL preview */}
              <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              {i === 0
                ? <span className="absolute left-1 bottom-1 px-1.5 py-0.5 rounded bg-gold text-brand-dk text-[10px] font-bold">MAIN</span>
                : <button type="button" onClick={() => makeMain(i)} className="absolute left-1 bottom-1 px-1.5 py-0.5 rounded bg-white/90 text-brand text-[10px] font-semibold cursor-pointer hover:bg-white">Make main</button>}
              <button type="button" onClick={() => remove(i)} aria-label={`Remove photo ${i + 1}`}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center cursor-pointer hover:bg-heart">✕</button>
            </div>
          ))}
        </div>
      )}
      {photos.length < MAX_PHOTOS && (
        <label className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border-2 border-dashed border-sage-dk/50 text-sm font-semibold text-brand cursor-pointer hover:bg-sage/50">
          📷 {photos.length ? "Add more photos" : "Upload photos"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={add} />
        </label>
      )}
      <p className="mt-1.5 text-xs text-brand/50">{photos.length}/{MAX_PHOTOS} photos · you can select several at once · the first one is shown on product cards</p>
    </div>
  );
}
