import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "motion-panel rounded-2xl border border-dashed border-line bg-panel p-8 text-center",
        className,
      )}
    >
      <p className="font-serif text-2xl font-semibold leading-tight text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
