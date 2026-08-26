"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function ProductBrowser({
  products,
  categories,
  initialCategory = "All",
}: {
  products: Product[];
  categories: string[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools (e.g. faceless video, SEO, email)..."
          className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm outline-none ring-indigo-500 focus:ring-2 sm:max-w-sm dark:border-white/15 dark:bg-white/5"
        />
        <p className="text-sm text-black/50 dark:text-white/50">
          {filtered.length} tool{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              category === c
                ? "bg-indigo-600 text-white"
                : "bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-black/15 p-8 text-center text-sm text-black/50 dark:border-white/15 dark:text-white/50">
          No tools match that search. Try a different keyword.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
