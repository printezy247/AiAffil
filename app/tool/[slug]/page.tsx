import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categorySlug, getProductBySlug, getRelatedProducts, products } from "@/lib/products";
import { getComparisonsForProduct } from "@/lib/comparisons";
import { ProductCard } from "@/components/ProductCard";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const comparisons = getComparisonsForProduct(product.slug);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href={`/category/${categorySlug(product.category)}`} className="mb-4 inline-block text-sm text-indigo-600 hover:underline">
        ← {product.category}
      </Link>
      <h1 className="mb-3 text-3xl font-bold tracking-tight">{product.name}</h1>
      {product.isAffiliateLink && (
        <span className="mb-4 inline-block rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
          This is an affiliate link — we may earn a commission if you sign up.
        </span>
      )}
      <p className="mb-8 text-lg text-black/70 dark:text-white/70">{product.description}</p>
      <a
        href={`/go/${product.slug}`}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="inline-block rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
      >
        Visit {product.name} →
      </a>

      {comparisons.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {comparisons.map((c) => {
            const other = c.a.slug === product.slug ? c.b : c.a;
            return (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-black/70 transition hover:bg-black/5 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10"
              >
                vs {other.name} →
              </Link>
            );
          })}
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-5 text-xl font-semibold">More in {product.category}</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
