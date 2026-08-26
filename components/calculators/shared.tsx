export function Field({
  label,
  value,
  onChange,
  step = "1",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-white/15 dark:bg-white/5"
      />
    </label>
  );
}

export function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-black/60 dark:text-white/60">{label}</span>
      <span className={highlight ? "text-lg font-bold text-indigo-600" : "text-sm font-semibold"}>{value}</span>
    </div>
  );
}
