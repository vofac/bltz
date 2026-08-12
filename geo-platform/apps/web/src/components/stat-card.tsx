import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="font-mono text-[11px] uppercase tracking-wide text-neutral-500">
        {label}
      </span>
      <span className="font-mono text-2xl font-semibold tabular-nums">{value}</span>
      {hint && <span className="text-xs text-neutral-400">{hint}</span>}
    </Card>
  );
}
