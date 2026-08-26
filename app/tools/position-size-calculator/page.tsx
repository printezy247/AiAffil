import type { Metadata } from "next";
import Link from "next/link";
import { PositionSizeCalculator } from "@/components/calculators/PositionSizeCalculator";

export const metadata: Metadata = {
  title: "Position Size Calculator",
  description: "Calculate how many units to buy based on your account size, risk tolerance, and stop-loss distance.",
};

export default function PositionSizeCalculatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Position Size Calculator</h1>
      <p className="mb-8 text-black/60 dark:text-white/60">
        Risking a fixed percentage of your account on every trade — not a fixed dollar amount — is the standard way
        to size positions. Enter your numbers below.
      </p>

      <PositionSizeCalculator />

      <div className="mt-10 rounded-lg border border-black/10 bg-black/[0.02] p-5 text-sm dark:border-white/10 dark:bg-white/5">
        <p className="mb-3">
          Ready to place the trade? Compare exchanges and trading bots on our{" "}
          <Link href="/brokers" className="font-medium text-indigo-600 hover:underline">
            exchanges &amp; bots page
          </Link>
          .
        </p>
        <p className="text-black/50 dark:text-white/50">This tool is for educational purposes only, not financial advice.</p>
      </div>
    </div>
  );
}
