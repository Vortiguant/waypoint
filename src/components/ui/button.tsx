import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const variants = {
    primary:
      "border border-accent bg-accent text-accent-ink hover:bg-ink hover:text-surface dark:hover:bg-ink dark:hover:text-canvas",
    secondary:
      "border border-line bg-surface text-ink hover:border-accent hover:bg-panel dark:bg-panel dark:hover:bg-surface",
    ghost:
      "text-muted hover:bg-panel hover:text-ink dark:hover:bg-panel",
    danger:
      "border border-danger/35 bg-danger/10 text-danger hover:bg-danger hover:text-white",
  } as const;

  return (
    <button
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-[var(--ease-out)] hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
