import type { Metadata } from "next";
import { brokers, getBrokerCategories } from "@/lib/brokers";

export const metadata: Metadata = {
  title: "Exchanges, Brokers & Trading Bots",
  description: "Compare crypto exchanges, automated trading bots, and charting platforms side by side.",
};

export default function BrokersPage() {
  const categories = getBrokerCategories();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Exchanges, Brokers &amp; Trading Bots</h1>
      <p className="mb-8 text-black/60 dark:text-white/60">
        Side-by-side comparison of where to trade and what to automate it with. Not financial advice — do your own
        research before funding any account.
      </p>

      {categories.map((category) => (
        <section key={category} className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">{category}</h2>
          <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-black/5 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 font-semibold">Platform</th>
                  <th className="px-4 py-3 font-semibold">Fees</th>
                  <th className="px-4 py-3 font-semibold">Best for</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {brokers
                  .filter((b) => b.category === category)
                  .map((b) => (
                    <tr key={b.slug} className="border-t border-black/10 dark:border-white/10">
                      <td className="px-4 py-4">
                        <div className="font-semibold">{b.name}</div>
                        <div className="text-black/60 dark:text-white/60">{b.tagline}</div>
                      </td>
                      <td className="px-4 py-4 align-top text-black/70 dark:text-white/70">{b.feeHighlight}</td>
                      <td className="px-4 py-4 align-top text-black/70 dark:text-white/70">{b.bestFor}</td>
                      <td className="px-4 py-4 align-top">
                        <a
                          href={`/go/${b.slug}`}
                          target="_blank"
                          rel="sponsored noopener noreferrer"
                          className="whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-500"
                        >
                          Visit →
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300">
        <strong>Risk disclosure:</strong> Trading cryptocurrency and using automated trading bots carries substantial
        risk of loss. Fees, features, and availability by region change frequently — always confirm current details
        on the platform&apos;s own site before signing up or depositing funds.
      </div>
    </div>
  );
}
