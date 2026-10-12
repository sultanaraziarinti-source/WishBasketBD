import Image from "next/image";
import Link from "next/link";

// Full-width static cover image (no slider / animation)
export default function HeroBanner() {
  return (
    <section className="w-full bg-cream">
      <Link href="/shop" aria-label="Shop Wish Basket BD" className="block relative w-full aspect-[2048/768] max-h-[600px]">
        <Image src="/banner.png" alt="Wish Basket BD — Your Favorite Finds, Delivered with Care" fill sizes="100vw" className="object-cover" preload />
      </Link>
    </section>
  );
}
