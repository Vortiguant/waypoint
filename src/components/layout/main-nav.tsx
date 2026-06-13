"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cloud, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { href: "/", label: "Explore" },
  { href: "/workspace", label: "Workspace" },
  { href: "/destinations", label: "Destinations" },
  { href: "/itinerary", label: "Itineraries" },
  { href: "/budget", label: "Insights" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex min-w-0 items-center gap-5 lg:gap-10">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-3 font-serif text-3xl font-semibold leading-none tracking-[-0.02em] text-accent transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:text-4xl"
          >
            <span className="grid size-11 place-items-center rounded-lg bg-panel">
              <Image
                src="/images/brand/waypoint-icon-64.png"
                alt=""
                width={44}
                height={44}
                priority
                aria-hidden="true"
                className="size-10"
              />
            </span>
            <span>Waypoint</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-11 items-center border-b-2 border-transparent text-sm font-semibold text-ink transition hover:border-line hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
                    isActive && "border-accent text-accent",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-soft">
            <Cloud className="size-4" aria-hidden="true" />
            Saved changes
          </span>
          <ThemeToggle />
          <Link
            href="/itinerary"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-accent bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink transition hover:-translate-y-px hover:bg-ink hover:text-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Plan a Trip
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Link
            href="/itinerary"
            className="inline-grid size-11 place-items-center rounded-lg border border-accent bg-accent text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Plan a trip"
          >
            <Compass className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </nav>

      <div className="grid grid-cols-5 border-t border-line bg-surface md:hidden">
        {navItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-12 items-center justify-center px-2 py-3 text-center text-xs font-bold text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent",
                isActive && "bg-panel text-accent",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
