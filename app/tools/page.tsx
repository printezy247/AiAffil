import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Calculators",
  description: "Free trading and investing calculators.",
};

const CALCULATORS = [
  {
    href: "/tools/position-size-calculator",
    name: "Position Size Calculator",
    description: "Work out how many units to buy based on your risk tolerance and stop-loss distance.",
  },
  {
    href: "/tools/compound-interest-calculator",
    name: "Compound Interest Calculator",
    description: "Project how your investments grow over time with regular contributions.",
  },
];

export default function ToolsIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Free Calculators</h1>
      <p className="mb-8 text-black/60 dark:text-white/60">Quick tools for trading and investing decisions.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {CALCULATORS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border border-black/10 p-5 transition hover:shadow-md dark:border-white/10"
          >
            <h2 className="mb-1 font-semibold">{c.name}</h2>
            <p className="text-sm text-black/60 dark:text-white/60">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
