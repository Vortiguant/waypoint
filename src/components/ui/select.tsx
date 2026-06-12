import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm font-semibold text-ink outline-none transition-[border-color,box-shadow,transform] duration-200 ease-[var(--ease-out)] focus:-translate-y-px focus:border-accent focus:ring-2 focus:ring-accent/20 dark:bg-panel",
        className,
      )}
      {...props}
    />
  );
}
