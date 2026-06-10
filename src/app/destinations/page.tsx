import { DestinationSearch } from "@/components/destinations/destination-search";

export default function DestinationsPage() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 border-b border-line pb-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-accent">Destination desk</p>
            <h1 className="mt-3 max-w-3xl font-serif text-5xl font-semibold leading-[0.96] tracking-[-0.025em] text-ink md:text-6xl">
              Select the route by evidence, not wanderlust.
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted lg:justify-self-end">
            Search the local destination set, compare seasonal fit and daily cost, then move the strongest candidate into planning.
          </p>
        </div>
        <DestinationSearch />
      </div>
    </section>
  );
}
