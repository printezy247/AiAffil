import type { Metadata } from "next";
import Link from "next/link";
import { PriceTicker } from "@/components/PriceTicker";

export const metadata: Metadata = {
  title: "Live Crypto Prices",
  description: "Live cryptocurrency prices, updated every minute.",
};

export default function MarketsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Live Crypto Prices</h1>
      <p className="mb-8 text-black/60 dark:text-white/60">Updates automatically every 60 seconds. Data from CoinGecko.</p>

      <PriceTicker />

      <div className="mt-10 rounded-lg border border-black/10 bg-black/[0.02] p-5 text-sm dark:border-white/10 dark:bg-white/5">
        <p>
          Ready to trade? Compare exchanges on our{" "}
          <Link href="/brokers" className="font-medium text-indigo-600 hover:underline">
            exchanges &amp; bots page
          </Link>
          , or size your position with the{" "}
          <Link href="/tools/position-size-calculator" className="font-medium text-indigo-600 hover:underline">
            position size calculator
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
