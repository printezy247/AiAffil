"use client";

import { useMemo, useState } from "react";
import { Field, ResultRow } from "./shared";

export function PositionSizeCalculator() {
  const [balance, setBalance] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [entryPrice, setEntryPrice] = useState("100");
  const [stopPrice, setStopPrice] = useState("95");

  const result = useMemo(() => {
    const bal = parseFloat(balance);
    const risk = parseFloat(riskPercent);
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopPrice);

    if (![bal, risk, entry, stop].every((n) => Number.isFinite(n) && n > 0) || entry === stop) return null;

    const riskAmount = bal * (risk / 100);
    const priceDiff = Math.abs(entry - stop);
    const positionSize = riskAmount / priceDiff;
    const positionValue = positionSize * entry;
    const percentOfAccount = (positionValue / bal) * 100;

    return { riskAmount, positionSize, positionValue, percentOfAccount };
  }, [balance, riskPercent, entryPrice, stopPrice]);

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Field label="Account balance ($)" value={balance} onChange={setBalance} />
        <Field label="Risk per trade (%)" value={riskPercent} onChange={setRiskPercent} step="0.1" />
        <Field label="Entry price ($)" value={entryPrice} onChange={setEntryPrice} step="0.01" />
        <Field label="Stop-loss price ($)" value={stopPrice} onChange={setStopPrice} step="0.01" />
      </div>

      <div className="rounded-xl border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">Result</h3>
        {result ? (
          <div className="flex flex-col gap-3">
            <ResultRow label="Amount at risk" value={`$${result.riskAmount.toFixed(2)}`} />
            <ResultRow label="Position size" value={`${result.positionSize.toFixed(4)} units`} highlight />
            <ResultRow label="Position value" value={`$${result.positionValue.toFixed(2)}`} />
            <ResultRow label="% of account deployed" value={`${result.percentOfAccount.toFixed(1)}%`} />
          </div>
        ) : (
          <p className="text-sm text-black/50 dark:text-white/50">Enter valid numbers (entry and stop-loss must differ) to see your position size.</p>
        )}
      </div>
    </div>
  );
}

