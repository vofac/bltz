import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus-visible:border-brand-500 focus-visible:ring-1 focus-visible:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
