import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const leftColumn = [
  {
    src: "/images/editorial/destination-kyoto.png",
    alt: "Autumn maple leaves framing a quiet Kyoto Zen garden and wooden temple porch.",
    caption: "Temple mornings",
  },
  {
    src: "/images/editorial/stay-aman-kyoto.png",
    alt: "Aman Kyoto suite with pale timber, low furniture, and garden-facing windows.",
    caption: "Quiet stays",
  },
  {
    src: "/images/editorial/destination-amalfi.png",
    alt: "Secluded Mediterranean cove with turquoise water and a wooden sailboat.",
    caption: "Coastal pauses",
  },
  {
    src: "/images/editorial/destination-provence.png",
    alt: "Sunlit Provence village lane with stone walls and planted terraces.",
    caption: "Market pacing",
  },
];

const centerColumn = [
  {
    src: "/images/editorial/kyoto-hero.png",
    alt: "Japanese temple pavilion reflected in a still pond during golden hour.",
    caption: "Anchor image",
  },
  {
    src: "/images/editorial/destination-marrakesh.png",
    alt: "Minimal ocher desert architecture in Morocco during golden hour.",
    caption: "Late-light contrast",
  },
  {
    src: "/images/editorial/destination-nordic-cabin.png",
    alt: "Modern glass cabin glowing in a snowy Nordic pine forest at twilight.",
    caption: "Retreat days",
  },
];

const rightColumn = [
  {
    src: "/images/editorial/stay-ritz-kyoto.png",
    alt: "Modern Kyoto hotel lounge with dark wood and broad garden-facing windows.",
    caption: "Arrival buffer",
  },
  {
    src: "/images/editorial/destination-yunnan-tea.png",
    alt: "Ceramic teapot with steam rising against a deep green tea terrace backdrop.",
    caption: "Ritual stops",
  },
  {
    src: "/images/editorial/destination-marrakesh.png",
    alt: "Marrakesh courtyard with earth-toned walls and late afternoon shadows.",
    caption: "Courtyard shade",
  },
  {
    src: "/images/editorial/destination-amalfi.png",
    alt: "Limestone cliffs dropping into clear Amalfi coast water.",
    caption: "Ferry windows",
  },
];

type GalleryImageData = {
  src: string;
  alt: string;
  caption: string;
};

interface StickyScrollProps {
  className?: string;
}

function GalleryImage({
  image,
  className,
  sizes,
}: {
  image: GalleryImageData;
  className?: string;
  sizes: string;
}) {
  return (
    <figure className={cn("group relative w-full overflow-hidden rounded-2xl border border-line bg-panel", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/72 to-transparent" aria-hidden="true" />
      <figcaption className="absolute inset-x-4 bottom-4 text-xs font-extrabold text-white">
        {image.caption}
      </figcaption>
    </figure>
  );
}

export function StickyScrollGallery({ className }: StickyScrollProps) {
  return (
    <section className={cn("border-y border-line bg-canvas px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24", className)}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="editorial-label text-accent">Route moodboard</p>
            <h2 className="mt-4 max-w-2xl text-wrap font-serif text-4xl font-semibold leading-tight tracking-[-0.02em] text-ink md:text-5xl">
              Keep the visual thread beside the plan.
            </h2>
          </div>
          <div className="max-w-2xl lg:ml-auto">
            <p className="max-w-[68ch] text-base leading-8 text-muted">
              A compact visual board keeps mood, lodging, pacing, and texture beside the route. Use it as a reminder that every beautiful stop still has to earn its place in the plan.
            </p>
            <Link
              href="/workspace"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-bold text-ink transition hover:-translate-y-px hover:border-accent hover:bg-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:bg-panel dark:hover:bg-surface"
            >
              Open workspace <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="grid gap-3 md:col-span-4">
            {leftColumn.map((image) => (
              <GalleryImage key={image.src + image.caption} image={image} className="h-72 sm:h-80 lg:h-96" sizes="(min-width: 1024px) 29vw, (min-width: 768px) 33vw, 100vw" />
            ))}
          </div>

          <div className="grid gap-3 md:sticky md:top-24 md:col-span-4 md:h-[calc(100vh-7rem)] md:grid-rows-3">
            {centerColumn.map((image) => (
              <GalleryImage key={image.src + image.caption} image={image} className="h-72 md:h-full" sizes="(min-width: 1024px) 29vw, (min-width: 768px) 33vw, 100vw" />
            ))}
          </div>

          <div className="grid gap-3 md:col-span-4">
            {rightColumn.map((image) => (
              <GalleryImage key={image.src + image.caption} image={image} className="h-72 sm:h-80 lg:h-96" sizes="(min-width: 1024px) 29vw, (min-width: 768px) 33vw, 100vw" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StickyScrollGallery;
