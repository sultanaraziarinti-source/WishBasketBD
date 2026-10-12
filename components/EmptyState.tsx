import Link from "next/link";

interface Props { icon: string; title: string; text?: string; href?: string; cta?: string; }

export default function EmptyState({ icon, title, text, href = "/shop", cta = "Browse Products" }: Props) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-3">{icon}</div>
      <p className="font-semibold text-lg text-brand">{title}</p>
      {text && <p className="text-sm text-brand/60 mt-1">{text}</p>}
      {href && <Link href={href} className="inline-block mt-5 px-6 py-3 rounded-full bg-brand text-cream text-sm font-semibold">{cta}</Link>}
    </div>
  );
}
