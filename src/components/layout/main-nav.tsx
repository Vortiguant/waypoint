"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BrandLogo } from "@/components/layout/brand-logo";

const navItems = [
  { href: "/", label: "Explore" },
  { href: "/workspace", label: "Workspace" },
  { href: "/destinations", label: "Destinations" },
  { href: "/itinerary", label: "Itinerary" },
  { href: "/budget", label: "Insights" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function useMobileNav() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export function MainNav() {
  const pathname = usePathname();
  const isMobile = useMobileNav();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex min-w-0 items-center gap-5 lg:gap-10">
          <Link
            href="/"
            className="transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            aria-label="Waypoint Travel Co. home"
          >
            <BrandLogo />
          </Link>

          <div
            className="hidden items-center gap-7 md:flex"
            aria-hidden={isMobile}
            inert={isMobile ? true : undefined}
          >
            {navItems.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={isMobile ? -1 : undefined}
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

        <div
          className="hidden items-center gap-4 lg:flex"
          aria-hidden={isMobile}
          inert={isMobile ? true : undefined}
        >
          <ThemeToggle />
          <Link
            href="/itinerary"
            tabIndex={isMobile ? -1 : undefined}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-accent bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink transition hover:-translate-y-px hover:bg-ink hover:text-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Plan a Trip
          </Link>
        </div>

        <div
          className="flex items-center gap-2 lg:hidden"
          aria-hidden={!isMobile}
          inert={!isMobile ? true : undefined}
        >
          <ThemeToggle />
          <Link
            href="/itinerary"
            tabIndex={!isMobile ? -1 : undefined}
            className="inline-grid size-11 place-items-center rounded-lg border border-accent bg-accent text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Plan a trip"
          >
            <Compass className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </nav>

      <div
        className="grid grid-cols-5 border-t border-line bg-surface md:hidden"
        aria-hidden={!isMobile}
        inert={!isMobile ? true : undefined}
      >
        {navItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={!isMobile ? -1 : undefined}
              className={cn(
                "flex min-h-12 items-center justify-center px-2 py-3 text-center text-xs font-bold text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent",
                isActive && "bg-panel text-accent",
              )}
              aria-label={isActive ? `${item.label}, current page` : item.label}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
