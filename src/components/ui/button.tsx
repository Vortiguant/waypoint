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
      "bg-accent text-accent-ink hover:bg-ink hover:text-surface dark:hover:bg-ink dark:hover:text-canvas",
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
        "inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 ease-out hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
