import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";

const footerLinks = [
  { href: "/workspace", label: "Workspace" },
  { href: "/destinations", label: "Destinations" },
  { href: "/itinerary", label: "Itinerary" },
  { href: "/budget", label: "Insights" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-panel px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Link
            href="/"
            className="transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            aria-label="Waypoint Travel Co. home"
          >
            <BrandLogo compact />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
            Elevating travel planning through editorial precision and data clarity.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted md:justify-end">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl text-xs text-muted">
        Copyright 2026 Waypoint Travel. All rights reserved.
      </div>
    </footer>
  );
}
