import type { Metadata } from "next";
import Link from "next/link";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";

export const metadata: Metadata = {
  title: "Compound Interest Calculator",
  description: "Project how your investments grow over time with regular contributions and compounding returns.",
};

export default function CompoundInterestCalculatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Compound Interest Calculator</h1>
      <p className="mb-8 text-black/60 dark:text-white/60">
        See how a starting amount plus regular monthly contributions grows over time at a given annual return.
      </p>

      <CompoundInterestCalculator />

      <div className="mt-10 rounded-lg border border-black/10 bg-black/[0.02] p-5 text-sm dark:border-white/10 dark:bg-white/5">
        <p className="mb-3">
          Looking for where to invest? Compare exchanges and platforms on our{" "}
          <Link href="/brokers" className="font-medium text-indigo-600 hover:underline">
            exchanges &amp; bots page
          </Link>
          .
        </p>
        <p className="text-black/50 dark:text-white/50">
          This tool assumes a constant return rate for simplicity — real markets fluctuate. Not financial advice.
        </p>
      </div>
    </div>
  );
}
