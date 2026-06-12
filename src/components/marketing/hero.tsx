import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[42rem] overflow-hidden border-b border-line px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <Image
        src="/images/editorial/kyoto-hero.png"
        alt="Japanese temple pavilion reflected in a still pond during golden hour."
        fill
        preload
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="motion-hero-media object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/34 to-black/10" />
      <div className="relative mx-auto flex min-h-[32rem] max-w-7xl flex-col justify-end">
        <div className="motion-hero-copy max-w-3xl pb-4">
          <p className="editorial-label text-white/78">Curated narratives</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold leading-[1.02] tracking-[-0.025em] text-white sm:text-6xl lg:text-7xl">
            Editorial travel planning for considered routes.
          </h1>
          <p className="mt-7 max-w-2xl text-base font-medium leading-8 text-white/88 md:text-lg">
            Moving beyond the destination, Waypoint curates experiences that honor the craft of exploration. From hidden coastal retreats to architectural wonders, shape your next chapter with evidence and calm.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/destinations">
              <Button className="w-full gap-2 sm:w-auto">
                Explore destinations <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/itinerary">
              <Button variant="secondary" className="w-full border-white/35 bg-white/10 text-white hover:border-white hover:bg-white/18 sm:w-auto">
                Plan an itinerary
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {["Architecture", "Coastal", "Culinary", "Slow Living"].map((item) => (
              <span
                key={item}
                className="rounded-lg border border-white/24 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white/82"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
