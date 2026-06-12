import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "motion-panel rounded-2xl border border-line bg-panel-raised p-6 dark:bg-panel-raised",
        className,
      )}
      {...props}
    />
  );
}
