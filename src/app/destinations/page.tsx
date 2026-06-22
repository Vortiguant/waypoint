import { DestinationSearch } from "@/components/destinations/destination-search";

export default function DestinationsPage() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="editorial-label text-accent">Destination desk</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-ink md:text-5xl">
              Select the route by evidence and atmosphere.
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-8 text-muted lg:justify-self-end">
            Search the local destination set, compare seasonal fit and daily cost, then open the strongest candidate as a composed planning brief.
          </p>
        </div>
        <DestinationSearch />
      </div>
    </section>
  );
}
