import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "success" | "neutral" | "warning";
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide",
        tone === "success" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
        tone === "warning" && "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
        tone === "neutral" &&
          "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
        className
      )}
      {...props}
    />
  );
}
