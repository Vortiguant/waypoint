import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DestinationGrid } from "@/components/destinations/destination-grid";
import { destinations } from "@/lib/data/mock-destinations";

export function FeatureGrid() {
  return (
    <section className="bg-surface px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-4xl font-semibold leading-tight tracking-[-0.02em] text-ink md:text-5xl">
              Editor&apos;s Choice
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted md:text-base">
              Our seasonal selection of places that inspire pause.
            </p>
          </div>
          <Link
            href="/destinations"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            View all destinations <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <DestinationGrid destinations={destinations.slice(0, 5)} />
      </div>
    </section>
  );
}
