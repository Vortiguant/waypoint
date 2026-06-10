import { CalendarCheck, CircleDollarSign, SearchCheck } from "lucide-react";

const features = [
  {
    icon: SearchCheck,
    title: "Scout with filters",
    description: "Compare mocked local destinations by mood, budget, region, and rating before committing to a route.",
  },
  {
    icon: CalendarCheck,
    title: "Edit the days",
    description: "Add, revise, reorder, and move plans with controls that work just as well from the keyboard.",
  },
  {
    icon: CircleDollarSign,
    title: "Keep the ledger",
    description: "Track trip totals, category weight, and per-traveler cost without spreadsheet drift.",
  },
];

export function FeatureGrid() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl border-y border-line py-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-accent">Planning system</p>
            <h2 className="mt-3 max-w-md font-serif text-4xl font-semibold leading-tight tracking-[-0.02em] text-ink">
              Three practical surfaces, one trip model.
            </h2>
          </div>
          <div className="grid gap-0 divide-y divide-line border-line md:grid-cols-3 md:divide-x md:divide-y-0">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article key={feature.title} className="py-5 md:px-5 md:py-1 first:pt-0 last:pb-0 md:first:pl-0 md:last:pr-0">
                  <Icon className="size-6 text-accent" aria-hidden="true" />
                  <h3 className="mt-6 text-lg font-bold text-ink">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
