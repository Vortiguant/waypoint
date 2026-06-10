"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/itinerary", label: "Itinerary" },
  { href: "/budget", label: "Budget" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link href="/" className="group flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
          <span className="grid size-10 place-items-center rounded-xl border border-line bg-panel text-ink transition group-hover:border-accent">
            <Compass className="size-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-serif text-xl font-semibold tracking-[-0.015em] text-ink">Waypoint</span>
            <span className="hidden text-xs font-semibold text-muted sm:block">Travel planning desk</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-semibold text-muted transition hover:bg-panel hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  isActive && "bg-panel text-ink",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/itinerary"
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-ink transition hover:bg-ink hover:text-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:inline-flex"
          >
            Plan trip
          </Link>
        </div>
      </nav>
      <div className="grid grid-cols-4 border-t border-line bg-surface md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-2 py-3 text-center text-xs font-semibold text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent",
                isActive && "bg-panel text-ink",
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
