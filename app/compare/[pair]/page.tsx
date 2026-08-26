import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllComparisonPairs, getComparisonBySlug } from "@/lib/comparisons";
import { categorySlug } from "@/lib/products";

export function generateStaticParams() {
  return getAllComparisonPairs().map((p) => ({ pair: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const { pair } = await params;
  const comparison = getComparisonBySlug(pair);
  if (!comparison) return {};
  return {
    title: `${comparison.a.name} vs ${comparison.b.name}`,
    description: `Compare ${comparison.a.name} and ${comparison.b.name} side by side — features, pricing model, and which one fits your workflow.`,
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const comparison = getComparisonBySlug(pair);
  if (!comparison) notFound();

  const { a, b } = comparison;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link href={`/category/${categorySlug(a.category)}`} className="mb-4 inline-block text-sm text-indigo-600 hover:underline">
        ← {a.category}
      </Link>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        {a.name} vs {b.name}
      </h1>
      <p className="mb-10 text-black/60 dark:text-white/60">
        Both are {a.category} tools. Here&apos;s how they compare, side by side.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {[a, b].map((tool) => (
          <div key={tool.slug} className="rounded-xl border border-black/10 p-6 dark:border-white/10">
            <h2 className="mb-2 text-xl font-bold">{tool.name}</h2>
            {tool.isAffiliateLink && (
              <span className="mb-3 inline-block rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                Affiliate link
              </span>
            )}
            <p className="mb-5 text-sm text-black/70 dark:text-white/70">{tool.description}</p>
            <div className="flex gap-2">
              <a
                href={`/go/${tool.slug}`}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                Visit {tool.name} →
              </a>
              <Link
                href={`/tool/${tool.slug}`}
                className="rounded-lg border border-black/10 px-3 py-2 text-center text-sm font-medium text-black/70 transition hover:bg-black/5 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-black/10 bg-black/[0.02] p-5 text-sm dark:border-white/10 dark:bg-white/5">
        <p>
          Not sure which fits your workflow? Try the{" "}
          <Link href="/quiz" className="font-medium text-indigo-600 hover:underline">
            2-question tool finder
          </Link>{" "}
          for a personalized recommendation, or browse every tool in{" "}
          <Link href={`/category/${categorySlug(a.category)}`} className="font-medium text-indigo-600 hover:underline">
            {a.category}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
