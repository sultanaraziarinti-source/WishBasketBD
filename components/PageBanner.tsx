import Link from "next/link";

interface Props {
  title: string;
  subtitle?: string;
  script?: string;
  crumbs?: [string, string?][];
  tone?: "sage" | "gold" | "brand";
}

const TONES = {
  sage: "bg-sage text-brand",
  gold: "bg-gold-lt text-brand",
  brand: "bg-brand text-cream",
};

export default function PageBanner({ title, subtitle, script, crumbs = [], tone = "sage" }: Props) {
  return (
    <div className={`mt-6 rounded-3xl px-6 py-8 md:py-10 ${TONES[tone]}`}>
      {crumbs.length > 0 && (
        <p className="text-xs opacity-70">
          <Link href="/" className="hover:underline">Home</Link>
          {crumbs.map(([label, href]) => <span key={label}> / {href ? <Link href={href} className="hover:underline">{label}</Link> : label}</span>)}
        </p>
      )}
      {script && <span className={`block font-script text-2xl ${tone === "brand" ? "text-gold" : "text-gold-dk"}`}>{script}</span>}
      <h1 className="mt-1 text-2xl md:text-4xl font-bold">{title}</h1>
      {subtitle && <p className="mt-1 text-sm opacity-75 max-w-2xl">{subtitle}</p>}
    </div>
  );
}
