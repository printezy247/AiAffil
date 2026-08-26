"use client";

import { useMemo, useState } from "react";
import { Field, ResultRow } from "./shared";

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("1000");
  const [monthlyContribution, setMonthlyContribution] = useState("100");
  const [annualRate, setAnnualRate] = useState("8");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const monthly = parseFloat(monthlyContribution);
    const rate = parseFloat(annualRate);
    const yrs = parseFloat(years);

    if (![p, monthly, rate, yrs].every((n) => Number.isFinite(n) && n >= 0) || yrs <= 0) return null;

    const monthlyRate = rate / 100 / 12;
    const months = yrs * 12;

    let balance = p;
    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + monthly;
    }

    const totalContributed = p + monthly * months;
    const totalInterest = balance - totalContributed;

    return { futureValue: balance, totalContributed, totalInterest };
  }, [principal, monthlyContribution, annualRate, years]);

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Field label="Starting amount ($)" value={principal} onChange={setPrincipal} />
        <Field label="Monthly contribution ($)" value={monthlyContribution} onChange={setMonthlyContribution} />
        <Field label="Estimated annual return (%)" value={annualRate} onChange={setAnnualRate} step="0.1" />
        <Field label="Years" value={years} onChange={setYears} />
      </div>

      <div className="rounded-xl border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">Result</h3>
        {result ? (
          <div className="flex flex-col gap-3">
            <ResultRow label="Future value" value={`$${result.futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} highlight />
            <ResultRow label="Total contributed" value={`$${result.totalContributed.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
            <ResultRow label="Total interest earned" value={`$${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          </div>
        ) : (
          <p className="text-sm text-black/50 dark:text-white/50">Enter valid numbers to see your projected growth.</p>
        )}
      </div>
    </div>
  );
}

