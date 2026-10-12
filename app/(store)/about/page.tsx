import Image from "next/image";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";

export const metadata = { title: "About Us — Wish Basket BD" };

const VALUES = [
  ["🤝", "Handpicked Quality", "Every product is chosen and checked by our team before it reaches you."],
  ["💚", "Prices You Adore", "Fair, honest pricing with regular offers on the things you love."],
  ["🚚", "Nationwide Delivery", "Carefully packed and delivered to your doorstep anywhere in Bangladesh."],
  ["💬", "Friendly Support", "Questions about an order? Our team is just a call or message away."],
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <PageBanner crumbs={[["About Us"]]} script="Our story" title="About Wish Basket BD" tone="brand" />

      <section className="mt-10 grid md:grid-cols-[320px_1fr] gap-8 items-center">
        <Image src="/logo.png" alt="Wish Basket BD" width={320} height={320} className="mx-auto" />
        <div className="space-y-4 text-brand/80 leading-relaxed">
          <h2 className="text-2xl md:text-3xl font-bold text-brand">Bringing happiness to your home ♥</h2>
          <p>Wish Basket BD started with a simple idea: everyone deserves a home that feels warm, beautiful and full of the little things they love. We bring together home essentials, kitchenware, decor, kids&apos; items, gifts and plants — all in one basket.</p>
          <p>We work with trusted makers and suppliers across Bangladesh and beyond, handpicking every product for quality and value. Whether you&apos;re setting up a new home, finding the perfect gift, or treating yourself, we&apos;re here to make it easy.</p>
          <Link href="/shop" className="inline-block px-7 py-3 rounded-full bg-gold hover:bg-gold-dk text-brand-dk font-bold transition-colors">Explore the Shop →</Link>
        </div>
      </section>

      <section className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {VALUES.map(([icon, title, text]) => (
          <div key={title} className="p-6 rounded-3xl bg-white border border-sage">
            <span className="w-12 h-12 rounded-full bg-gold-lt flex items-center justify-center text-2xl">{icon}</span>
            <h3 className="mt-3 font-bold text-brand">{title}</h3>
            <p className="mt-1 text-sm text-brand/70">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
