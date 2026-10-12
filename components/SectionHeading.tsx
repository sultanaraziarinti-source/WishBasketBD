import Link from "next/link";

interface Props {
  title: string;
  /** Second word(s), drawn in brand green after the dark first part */
  accent?: string;
  href?: string;
  linkLabel?: string;
}

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M7 17 17 7M8 7h9v9" /></svg>
);

export default function SectionHeading({ title, accent, href, linkLabel = "View All" }: Props) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
      <h2 className="text-2xl md:text-[40px] leading-tight font-extrabold text-brand-dk">
        {title}{accent && <> <span className="text-brand">{accent}</span></>}
      </h2>
      {href && (
        <Link href={href} className="shrink-0 flex items-center gap-1.5 text-sm md:text-[17px] font-semibold text-brand-dk/70 hover:text-brand">
          {linkLabel} <Arrow />
        </Link>
      )}
    </div>
  );
}
