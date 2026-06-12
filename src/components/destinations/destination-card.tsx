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
      className={cn(
        "group motion-panel relative block overflow-hidden rounded-2xl bg-panel-raised text-white outline-none ring-offset-2 ring-offset-canvas transition-[transform,box-shadow,filter] duration-300 ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-accent",
        "hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] active:translate-y-0",
        featured ? "min-h-[28rem] md:min-h-[34rem]" : "min-h-[21rem]",
      )}
    >
      <Image
        src={destination.imageSrc}
        alt={destination.imageAlt}
        fill
        preload={priority}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        sizes={featured ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
        className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/18 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        {badge ? (
          <p className="editorial-label mb-3 text-white/80">{badge}</p>
        ) : null}
        <p className="editorial-label text-white/75">{destination.country}</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-3xl">
          {destination.name}
        </h2>
        <p className="mt-3 max-w-md text-sm font-medium leading-6 text-white/90">
          {destination.description}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold text-white/85">
          <span>{destination.rating.toFixed(1)} rating</span>
          <span aria-hidden="true">/</span>
          <span>{formatCurrency(destination.estimatedDailyCost)} / day</span>
          <ArrowRight className="ml-auto size-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
