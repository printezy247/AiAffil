import Link from "next/link";
import type { Product } from "@/lib/products";
import { categorySlug } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col rounded-xl border border-black/10 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
      <div className="mb-2 flex items-start justify-between gap-2">
        <Link href={`/tool/${product.slug}`} className="text-lg font-semibold hover:underline">
          {product.name}
        </Link>
        {product.isAffiliateLink && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            Affiliate
          </span>
        )}
      </div>
      <Link
        href={`/category/${categorySlug(product.category)}`}
        className="mb-3 w-fit rounded-full bg-black/5 px-2.5 py-1 text-xs text-black/60 hover:bg-black/10 dark:bg-white/10 dark:text-white/60"
      >
        {product.category}
      </Link>
      <p className="mb-4 line-clamp-4 flex-1 text-sm text-black/70 dark:text-white/70">{product.description}</p>
      <div className="flex gap-2">
        <a
          href={`/go/${product.slug}`}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Visit {product.name} →
        </a>
        <Link
          href={`/tool/${product.slug}`}
          className="rounded-lg border border-black/10 px-3 py-2 text-center text-sm font-medium text-black/70 transition hover:bg-black/5 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
