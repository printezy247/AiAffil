"use client";

import { useState } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "./ProductCard";

const GOAL_TO_CATEGORY: Record<string, string> = {
  "Grow a YouTube/social video channel": "Faceless Video & Content Automation",
  "Write blogs, posts, or copy faster": "Writing, Copywriting & AI Chat",
  "Get more leads & sales automatically": "CRM, Sales & Marketing Automation",
  "Build a website or app": "No-Code Website, App & AI Builders",
  "Rank higher on Google": "SEO & Growth Marketing",
  "Design graphics & branding": "Design, Photo & Brand Assets",
  "Stay organized & run my business": "Productivity & Business Ops",
};

const GOALS = Object.keys(GOAL_TO_CATEGORY);
const BUDGETS = ["Free tools only", "Paid is fine if it's worth it"] as const;

export function Quiz() {
  const [goal, setGoal] = useState<string | null>(null);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number] | null>(null);

  const category = goal ? GOAL_TO_CATEGORY[goal] : null;
  const results = category
    ? products
        .filter((p) => p.category === category)
        .filter((p) => (budget === "Free tools only" ? !p.isAffiliateLink : true))
        .sort((a, b) => Number(b.featured) - Number(a.featured))
        .slice(0, 3)
    : [];

  function reset() {
    setGoal(null);
    setBudget(null);
  }

  if (!goal) {
    return (
      <div>
        <h2 className="mb-4 text-lg font-semibold">What&apos;s your main goal right now?</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GOALS.map((g) => (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className="rounded-lg border border-black/10 p-4 text-left text-sm font-medium transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-white/10 dark:hover:bg-indigo-950/30"
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div>
        <button onClick={() => setGoal(null)} className="mb-4 text-sm text-indigo-600 hover:underline">
          ← Back
        </button>
        <h2 className="mb-4 text-lg font-semibold">Got it. What&apos;s your budget?</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BUDGETS.map((b) => (
            <button
              key={b}
              onClick={() => setBudget(b)}
              className="rounded-lg border border-black/10 p-4 text-left text-sm font-medium transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-white/10 dark:hover:bg-indigo-950/30"
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={reset} className="mb-4 text-sm text-indigo-600 hover:underline">
        ← Start over
      </button>
      <h2 className="mb-2 text-lg font-semibold">Your picks for &quot;{goal}&quot;</h2>
      {results.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">
          No free tools matched that combination — try &quot;Paid is fine if it&apos;s worth it&quot; to see more options.
        </p>
      ) : (
        <>
          <p className="mb-5 text-sm text-black/60 dark:text-white/60">
            Based on your goal and budget, here {results.length === 1 ? "is" : "are"} our top pick{results.length === 1 ? "" : "s"}:
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
