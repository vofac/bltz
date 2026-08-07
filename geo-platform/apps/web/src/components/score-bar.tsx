export function ScoreBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-mono tabular-nums text-neutral-500">
          {value} / {max}
        </span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
        <div
          className="h-2 rounded-full bg-brand-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
