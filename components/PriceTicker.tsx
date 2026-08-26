"use client";

import { useEffect, useState } from "react";

const COINS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "solana", symbol: "SOL" },
  { id: "binancecoin", symbol: "BNB" },
  { id: "ripple", symbol: "XRP" },
  { id: "dogecoin", symbol: "DOGE" },
  { id: "cardano", symbol: "ADA" },
];

type PriceData = Record<string, { usd: number; usd_24h_change: number }>;

const REFRESH_MS = 60_000;

/**
 * Live crypto prices from CoinGecko's free public API — no API key needed.
 * Fetches client-side (in the visitor's browser) and refreshes every 60s.
 * If the API is unreachable or rate-limits, shows a quiet fallback message
 * instead of breaking the page.
 */
export function PriceTicker() {
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchPrices() {
      try {
        const ids = COINS.map((c) => c.id).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        );
        if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setPrices(data);
          setError(false);
        }
      } catch (err) {
        console.error("Price ticker fetch failed:", err);
        if (!cancelled) setError(true);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (error) {
    return (
      <p className="rounded-lg border border-dashed border-black/15 p-4 text-center text-sm text-black/50 dark:border-white/15 dark:text-white/50">
        Live prices are temporarily unavailable. Try refreshing the page.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
      {COINS.map((coin) => {
        const data = prices?.[coin.id];
        return (
          <div
            key={coin.id}
            className="rounded-xl border border-black/10 bg-white p-4 text-center dark:border-white/10 dark:bg-white/5"
          >
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
              {coin.symbol}
            </div>
            {data ? (
              <>
                <div className="text-lg font-bold">
                  ${data.usd.toLocaleString(undefined, { maximumFractionDigits: data.usd < 1 ? 4 : 2 })}
                </div>
                <div className={`text-xs font-medium ${data.usd_24h_change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {data.usd_24h_change >= 0 ? "▲" : "▼"} {Math.abs(data.usd_24h_change).toFixed(2)}%
                </div>
              </>
            ) : (
              <div className="text-sm text-black/30 dark:text-white/30">…</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
