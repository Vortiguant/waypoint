"use client";

import { useMemo } from "react";
import { Minus, Plus } from "lucide-react";
import { BudgetCategoryList } from "@/components/budget/budget-category-list";
import { BudgetSummaryCard } from "@/components/budget/budget-summary-card";
import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/ui/status-message";
import { calculateBudget } from "@/lib/budget/calculate";
import { useTrip } from "@/store/trip-store";

export function BudgetDashboard() {
  const { trip, hasHydrated, dispatch } = useTrip();
  const summary = useMemo(() => calculateBudget(trip), [trip]);

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border border-line bg-surface p-5 md:p-8">
            <p className="text-sm font-semibold text-accent">Budget ledger</p>
            <h1 className="mt-3 font-serif text-5xl font-semibold leading-[0.96] tracking-[-0.025em] text-ink md:text-6xl">
              Know what the trip really costs.
            </h1>
            <p className="mt-5 text-base leading-7 text-muted">
              Waypoint totals every activity, groups spend by category, and keeps the per-traveler number visible while the itinerary changes.
            </p>
            <div className="mt-8 border border-line bg-panel p-4">
              <p className="text-sm font-bold text-muted">Travelers</p>
              <div className="mt-3 flex items-center gap-3">
                <Button type="button" variant="secondary" className="size-10 px-0" disabled={trip.travelers <= 1} onClick={() => dispatch({ type: "setTravelers", travelers: trip.travelers - 1 })}>
                  <Minus className="size-4" aria-hidden="true" />
                  <span className="sr-only">Remove traveler</span>
                </Button>
                <span className="min-w-12 text-center font-serif text-4xl font-semibold">{trip.travelers}</span>
                <Button type="button" variant="secondary" className="size-10 px-0" onClick={() => dispatch({ type: "setTravelers", travelers: trip.travelers + 1 })}>
                  <Plus className="size-4" aria-hidden="true" />
                  <span className="sr-only">Add traveler</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {!hasHydrated ? <StatusMessage tone="info">Loading saved budget details…</StatusMessage> : null}
            <BudgetSummaryCard summary={summary} currency={trip.currency} travelers={trip.travelers} />
            <BudgetCategoryList summary={summary} currency={trip.currency} />
          </div>
        </div>
      </div>
    </section>
  );
}
