import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm font-medium text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:bg-panel",
        className,
      )}
      {...props}
    />
  );
}
