import { getAllCategories, getFeaturedProducts, products } from "@/lib/products";
import { ProductBrowser } from "@/components/ProductBrowser";
import { ProductCard } from "@/components/ProductCard";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  const categories = getAllCategories();
  const featured = getFeaturedProducts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="mb-14 text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">{siteConfig.tagline}</h1>
        <p className="mx-auto max-w-2xl text-black/60 dark:text-white/60">
          {products.length} AI and creator tools, organized into {categories.length} categories, so you can stop scrolling
          spreadsheets and start using them.
        </p>
      </section>

      {featured.length > 0 && (
        <section className="mb-16">
          <h2 className="mb-5 text-xl font-semibold">Featured picks</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <section id="tools">
        <h2 className="mb-5 text-xl font-semibold">Browse all tools</h2>
        <ProductBrowser products={products} categories={categories} />
      </section>
    </div>
  );
}
