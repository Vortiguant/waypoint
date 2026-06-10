import Link from "next/link";
import { ArrowRight, CalendarDays, MapPinned, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-accent">Editorial travel planning</p>
          <h1 className="mt-4 font-serif text-6xl font-semibold leading-[0.94] tracking-[-0.03em] text-ink sm:text-7xl lg:text-8xl">
            A quieter desk for sharper trips.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
            Waypoint turns destination evidence, day-by-day schedules, conflict checks, and budget math into one composed planning workspace.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/itinerary">
              <Button className="w-full gap-2 sm:w-auto">
                Start the itinerary <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/destinations">
              <Button variant="secondary" className="w-full sm:w-auto">Browse destinations</Button>
            </Link>
          </div>
        </div>

        <div className="border border-line bg-surface p-4 md:p-5">
          <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
            <article className="flex min-h-72 flex-col justify-between bg-panel p-5">
              <div>
                <MapPinned className="size-6 text-accent" aria-hidden="true" />
                <p className="mt-7 font-serif text-4xl font-semibold leading-none tracking-[-0.02em]">Kyoto field notes</p>
                <p className="mt-4 text-sm leading-6 text-muted">Temple gardens at dawn, Nishiki for lunch, ryokan tea before the evening train.</p>
              </div>
              <p className="mt-6 text-sm font-semibold text-ink">4.9 rating · Mar, Apr, Nov</p>
            </article>

            <div className="space-y-4">
              <article className="bg-ink p-5 text-surface dark:bg-panel dark:text-ink">
                <CalendarDays className="size-6" aria-hidden="true" />
                <div className="mt-6 space-y-4">
                  {[
                    ["06:30", "Fushimi Inari sunrise"],
                    ["12:00", "Nishiki Market lunch"],
                    ["15:00", "Ceramics studio visit"],
                  ].map(([time, label]) => (
                    <div key={label} className="grid grid-cols-[3.5rem_1fr] gap-3 border-t border-surface/20 pt-3 text-sm dark:border-ink/15">
                      <span className="font-mono opacity-70">{time}</span>
                      <span className="font-semibold">{label}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="border border-line p-5">
                <WalletCards className="size-6 text-accent" aria-hidden="true" />
                <p className="mt-6 text-sm font-semibold text-muted">Trip budget</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <p className="font-serif text-5xl font-semibold leading-none tracking-[-0.02em]">$694</p>
                  <p className="pb-1 text-sm font-semibold text-muted">$347 per traveler</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
