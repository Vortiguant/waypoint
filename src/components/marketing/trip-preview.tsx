import Link from "next/link";
import { destinations } from "@/lib/data/mock-destinations";
import { formatCurrency } from "@/lib/utils";

export function TripPreview() {
  const picks = destinations.slice(0, 3);

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl bg-ink p-5 text-surface dark:bg-surface dark:text-ink md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-accent">Scout board</p>
            <h2 className="mt-3 font-serif text-5xl font-semibold leading-none tracking-[-0.025em]">
              Choose where next with enough signal to act.
            </h2>
            <p className="mt-5 text-sm leading-7 opacity-75">
              Each destination carries seasonality, daily cost, region, and trip style without burying the decision in decoration.
            </p>
            <Link href="/destinations" className="mt-8 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-ink transition hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent dark:hover:bg-ink dark:hover:text-surface">
              Open destinations
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {picks.map((destination) => (
              <article key={destination.id} className="border border-surface/15 bg-surface/5 p-3 dark:border-line dark:bg-panel">
                <div className="h-32" style={{ background: destination.image }} />
                <h3 className="mt-5 font-serif text-2xl font-semibold leading-none">{destination.name}</h3>
                <p className="mt-2 text-sm font-semibold opacity-65">{destination.region}</p>
                <p className="mt-5 text-sm font-bold">{formatCurrency(destination.estimatedDailyCost)} / day</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
