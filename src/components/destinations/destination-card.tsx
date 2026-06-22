import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Destination } from "@/types/travel";
import { cn, formatCurrency } from "@/lib/utils";

export function DestinationCard({
  destination,
  priority = false,
  featured = false,
  badge,
}: {
  destination: Destination;
  priority?: boolean;
  featured?: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={`/destinations/${destination.id}`}
      aria-label={`${destination.name}, ${destination.country}`}
      className={cn(
        "group motion-panel block h-full overflow-hidden rounded-2xl border border-line bg-panel-raised text-ink outline-none transition-[border-color,transform] duration-200 ease-[var(--ease-out)] hover:-translate-y-px hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0",
        featured && "xl:grid xl:grid-cols-[1.1fr_0.9fr]",
      )}
    >
      <div className={cn("relative aspect-[4/3] bg-panel", featured && "xl:aspect-auto xl:min-h-[24rem]")}> 
        <Image
          src={destination.imageSrc}
          alt={destination.imageAlt}
          fill
          preload={priority}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          sizes={featured ? "(min-width: 1280px) 42vw, (min-width: 768px) 50vw, 100vw" : "(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"}
          className="object-cover"
        />
      </div>
      <div className="p-5 md:p-6">
        {badge ? (
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.11em] text-accent">{badge}</p>
        ) : null}
        <p className="text-xs font-extrabold uppercase tracking-[0.11em] text-muted">{destination.country}</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-3xl">
          {destination.name}
        </h2>
        <p className="mt-3 max-w-md text-sm font-medium leading-6 text-muted">
          {destination.description}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-extrabold text-ink">
          <span>{destination.rating.toFixed(1)} rating</span>
          <span aria-hidden="true">/</span>
          <span>{formatCurrency(destination.estimatedDailyCost)} / day</span>
          <ArrowRight className="ml-auto size-4 text-accent transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
