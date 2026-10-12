interface Props {
  featured: boolean;
  newArrival: boolean;
  onChange: (tags: { featured: boolean; newArrival: boolean }) => void;
}

// Two independent switches — a product can be Featured, a New Arrival, both, or neither
export default function TagToggles({ featured, newArrival, onChange }: Props) {
  const box = (on: boolean) => `flex items-center gap-2.5 px-3.5 h-11 rounded-xl border-2 text-sm font-medium cursor-pointer select-none ${on ? "border-brand bg-sage/60 text-brand-dk" : "border-sage bg-white text-brand/70"}`;
  return (
    <div className="flex flex-wrap gap-2">
      <label className={box(featured)}>
        <input type="checkbox" checked={featured} onChange={e => onChange({ featured: e.target.checked, newArrival })} className="accent-brand w-4 h-4" />
        🔥 Featured
      </label>
      <label className={box(newArrival)}>
        <input type="checkbox" checked={newArrival} onChange={e => onChange({ featured, newArrival: e.target.checked })} className="accent-brand w-4 h-4" />
        ✨ New Arrival
      </label>
    </div>
  );
}
