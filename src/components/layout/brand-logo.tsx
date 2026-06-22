import { cn } from "@/lib/utils";

export function BrandLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-3", className)}>
      <span className="relative grid size-12 shrink-0 place-items-center rounded-full border border-accent/35 bg-accent-soft/45 text-accent dark:bg-panel">
        <svg
          viewBox="0 0 48 48"
          className="size-9"
          role="img"
          aria-label="Waypoint compass mark"
        >
          <path
            d="M24 3.5 29.6 18.4 44.5 24 29.6 29.6 24 44.5 18.4 29.6 3.5 24 18.4 18.4 24 3.5Z"
            fill="currentColor"
            opacity="0.18"
          />
          <path
            d="M24 7.5 28.3 19.7 40.5 24 28.3 28.3 24 40.5 19.7 28.3 7.5 24 19.7 19.7 24 7.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M24 13.8 27.2 24 24 34.2 20.8 24 24 13.8Z"
            fill="currentColor"
          />
          <path
            d="M14.5 27.5c4.4-5.6 9.8-7.5 16.1-5.9"
            fill="none"
            stroke="var(--accent-ink)"
            strokeLinecap="round"
            strokeWidth="2.4"
          />
          <circle cx="31.5" cy="22.2" r="2.7" fill="var(--danger)" />
        </svg>
      </span>
      <span className="min-w-0 leading-none">
        <span className="block font-serif text-3xl font-semibold tracking-[-0.015em] text-accent">
          Waypoint
        </span>
        {!compact ? (
          <span className="mt-1 hidden text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-muted sm:block">
            Travel Co.
          </span>
        ) : null}
      </span>
    </span>
  );
}
