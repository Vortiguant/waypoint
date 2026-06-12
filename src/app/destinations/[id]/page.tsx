import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DestinationInquiryForm } from "@/components/destinations/destination-inquiry-form";
import { SaveButton } from "@/components/destinations/save-button";
import { destinations, getDestinationById } from "@/lib/data/mock-destinations";

export function generateStaticParams() {
  return destinations.map((destination) => ({ id: destination.id }));
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = getDestinationById(id);

  if (!destination) {
    notFound();
  }

  return (
    <>
      <section className="relative min-h-[32rem] overflow-hidden md:min-h-[38rem]">
        <Image
          src={destination.heroImageSrc}
          alt={destination.heroImageAlt}
          fill
          preload
          sizes="100vw"
          className="motion-hero-media object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-black/5" />
        <div className="relative mx-auto flex min-h-[32rem] max-w-7xl flex-col justify-end px-4 pb-14 pt-20 sm:px-6 md:min-h-[38rem] md:pb-20 lg:px-8">
          <Link
            href="/destinations"
            className="mb-auto inline-flex min-h-11 w-fit items-center gap-2 rounded-lg border border-white/25 bg-black/20 px-3 py-2 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Destinations
          </Link>
          <div className="motion-hero-copy max-w-3xl text-white">
            <p className="mb-5 inline-flex rounded-lg border border-white/25 bg-white/12 px-3 py-1 text-xs font-bold">
              {destination.region}, {destination.country}
            </p>
            <h1 className="font-serif text-5xl font-semibold leading-[1.02] tracking-[-0.025em] md:text-7xl">
              {destination.editorialTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/90 md:text-lg">
              {destination.detailSummary}
            </p>
            <div className="mt-6">
              <SaveButton id={destination.id} label={destination.name} kind="destination" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_26rem]">
          <div className="space-y-14">
            <div>
              <h2 className="font-serif text-4xl font-semibold leading-tight tracking-[-0.02em] text-ink md:text-5xl">
                About the Craft
              </h2>
              <p className="mt-7 max-w-[70ch] text-base leading-8 text-muted md:text-lg">
                {destination.detailDescription}
              </p>
            </div>

            <div>
              <h3 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-ink">
                Top Decisions
              </h3>
              <div className="motion-grid mt-8 space-y-7">
                {destination.decisions.map((decision, index) => (
                  <article key={decision.title} className="grid gap-5 sm:grid-cols-[4rem_1fr]">
                    <span className="font-serif text-5xl font-semibold leading-none text-line">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="editorial-label text-accent">{decision.label}</p>
                      <h4 className="mt-2 text-lg font-bold text-ink">{decision.title}</h4>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                        {decision.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="motion-panel h-fit rounded-2xl border border-line bg-panel-raised p-5 editorial-shadow lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl font-semibold text-ink">Plan Your Sojourn</h2>
            <DestinationInquiryForm destinationName={destination.name} />
            <p className="mt-5 text-center text-xs italic leading-5 text-muted">
              Our lead times are currently 72 hours for custom itineraries.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-panel px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-4xl font-semibold tracking-[-0.02em] text-ink">
                Recommended Stays
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Curated sanctuaries that prioritize architecture and silence.
              </p>
            </div>
            <Link href="/destinations" className="hidden min-h-11 items-center text-sm font-bold text-accent hover:text-ink sm:inline-flex">
              View all
            </Link>
          </div>
          <div className="motion-grid grid gap-5 md:grid-cols-3">
            {destination.stays.map((stay) => (
              <article key={stay.name} className="motion-panel overflow-hidden rounded-2xl border border-line bg-panel-raised">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={stay.imageSrc}
                    alt={stay.imageAlt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {stay.tags.map((tag) => (
                      <span key={tag} className="rounded bg-panel px-2 py-1 text-xs font-semibold text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <h3 className="font-serif text-2xl font-semibold tracking-[-0.015em] text-ink">{stay.name}</h3>
                    <SaveButton
                      id={`${destination.id}:${stay.name}`}
                      label={stay.name}
                      kind="stay"
                      compact
                    />
                  </div>
                  <p className="mt-3 min-h-20 text-sm leading-6 text-muted">{stay.description}</p>
                  <p className="mt-5 text-sm font-bold text-ink">{stay.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
