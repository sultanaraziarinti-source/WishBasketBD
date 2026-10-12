"use client";
import CollectionTiles from "@/components/CollectionTiles";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import { useShop } from "@/context/ShopContext";
import { isFeatured, isNew } from "@/lib/products";

const grid = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6";

export default function HomePage() {
  const { products, categories } = useShop();
  const featured = products.filter(isFeatured).slice(0, 5);
  const arrivals = products.filter(isNew).slice(0, 5);

  return (
    <>
      <HeroBanner />

      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        {/* Explore Collections */}
        <section className="mt-12 md:mt-16">
          <SectionHeading title="Explore" accent="Collections" href="/categories" linkLabel="View All Categories" />
          <CollectionTiles categories={categories} />
        </section>

        {featured.length > 0 && (
          <section className="mt-14 md:mt-20">
            <SectionHeading title="Our Featured" accent="Products" href="/shop" linkLabel="View All Products" />
            <div className={grid}>{featured.map(p => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}

        {arrivals.length > 0 && (
          <section className="mt-14 md:mt-20">
            <SectionHeading title="New" accent="Arrivals" href="/shop" linkLabel="View All Products" />
            <div className={grid}>{arrivals.map(p => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}

        {/* One row per category, like chalkpencil */}
        {categories.map(c => {
          const items = products.filter(p => p.category === c.key).slice(0, 5);
          if (!items.length) return null;
          const [first, ...rest] = c.label.split(" ");
          return (
            <section key={c.key} className="mt-14 md:mt-20">
              <SectionHeading title={first} accent={rest.join(" ")} href={`/category/${c.key}`} />
              <div className={grid}>{items.map(p => <ProductCard key={p.id} product={p} />)}</div>
            </section>
          );
        })}
      </div>
    </>
  );
}
