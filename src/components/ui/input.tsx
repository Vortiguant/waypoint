import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-ink outline-none transition-[border-color,box-shadow,transform] duration-200 ease-[var(--ease-out)] placeholder:text-soft focus:-translate-y-px focus:border-accent focus:ring-2 focus:ring-accent/20 dark:bg-panel",
        className,
      )}
      {...props}
    />
  );
}
