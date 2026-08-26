import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categorySlug, getAllCategories, getCategoryBySlug, products } from "@/lib/products";
import { ProductBrowser } from "@/components/ProductBrowser";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ slug: categorySlug(category) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category,
    description: `Curated ${category.toLowerCase()} tools worth trying.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryProducts = products.filter((p) => p.category === category);
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{category}</h1>
      <p className="mb-8 text-black/60 dark:text-white/60">
        {categoryProducts.length} tool{categoryProducts.length === 1 ? "" : "s"} in this category.
      </p>
      <ProductBrowser products={products} categories={categories} initialCategory={category} />
    </div>
  );
}
