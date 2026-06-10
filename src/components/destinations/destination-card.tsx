import type { Destination } from "@/types/travel";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function DestinationCard({
  destination,
  priority = false,
}: {
  destination: Destination;
  priority?: boolean;
}) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-px hover:border-accent/45">
      <div className="relative h-44 overflow-hidden bg-panel">
        <div className="absolute inset-0 scale-105 transition-transform duration-500 ease-out group-hover:scale-100" style={{ background: destination.image }} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
              {destination.country} · {destination.region}
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold leading-none tracking-[-0.015em]">
              {destination.name}
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-sm font-bold text-ink">
            {destination.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {priority ? (
          <p className="mb-4 border-b border-line pb-3 text-sm font-semibold text-accent">
            Strongest current match
          </p>
        ) : null}
        <p className="text-sm leading-6 text-muted">{destination.description}</p>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-line py-4">
          <div>
            <dt className="text-xs font-semibold text-muted">Best window</dt>
            <dd className="mt-1 text-sm font-bold text-ink">{destination.bestMonths.join(", ")}</dd>
          </div>
          <div className="text-right">
            <dt className="text-xs font-semibold text-muted">Daily cost</dt>
            <dd className="mt-1 text-sm font-bold text-ink">
              {formatCurrency(destination.estimatedDailyCost)}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
          {destination.tags.map((tag) => (
            <span key={tag} className="text-xs font-semibold text-muted">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
