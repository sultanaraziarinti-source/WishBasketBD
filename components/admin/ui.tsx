// Shared building blocks for admin pages
export const card = "bg-white rounded-2xl border border-sage";
export const btnPrimary = "inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-brand hover:bg-brand-dk text-cream text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50";
export const btnGold = "inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-gold hover:bg-gold-dk text-brand-dk text-sm font-semibold transition-colors cursor-pointer";
export const btnGhost = "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full border-2 border-sage text-brand text-sm font-semibold hover:bg-sage transition-colors cursor-pointer";
export const btnDanger = "inline-flex items-center justify-center gap-2 h-9 px-3 rounded-full text-heart text-sm font-semibold hover:bg-heart/10 transition-colors cursor-pointer";
export const field = "w-full h-11 px-3.5 rounded-xl border-2 border-sage bg-white text-sm focus:outline-none focus:border-brand";
export const label = "block text-xs font-semibold text-brand/80 mb-1.5";

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-brand">{title}</h2>
        {sub && <p className="text-sm text-brand/60">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatTile({ label, value, hint, tone = "plain" }: { label: string; value: React.ReactNode; hint?: React.ReactNode; tone?: "plain" | "brand" | "warn" }) {
  const t = tone === "brand" ? "bg-brand text-cream border-brand" : tone === "warn" ? "bg-gold-lt border-gold/40" : "bg-white border-sage";
  return (
    <div className={`rounded-2xl border p-5 ${t}`}>
      <p className={`text-xs font-medium ${tone === "brand" ? "text-cream/70" : "text-brand/60"}`}>{label}</p>
      <p className={`mt-1 text-2xl md:text-3xl font-bold tabular-nums ${tone === "brand" ? "text-gold" : "text-brand"}`}>{value}</p>
      {hint && <p className={`mt-1 text-xs ${tone === "brand" ? "text-cream/60" : "text-brand/50"}`}>{hint}</p>}
    </div>
  );
}
