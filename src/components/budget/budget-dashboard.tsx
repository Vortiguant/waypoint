"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Share2, UsersRound } from "lucide-react";
import { BudgetCategoryList } from "@/components/budget/budget-category-list";
import { BudgetSummaryCard } from "@/components/budget/budget-summary-card";
import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/ui/status-message";
import { calculateBudget } from "@/lib/budget/calculate";
import { destinations, getDestinationById } from "@/lib/data/mock-destinations";
import { calculateTripInsights } from "@/lib/insights/calculate";
import { createTripShareSummary } from "@/lib/sharing/trip-summary";
import { useTrip } from "@/store/trip-store";
import type { InsightScore } from "@/types/travel";

function scoreTone(status: InsightScore["status"]) {
  if (status === "good") return "border-positive/30 bg-positive/10 text-positive";
  if (status === "watch") return "border-warning/35 bg-warning/10 text-ink";
  return "border-danger/35 bg-danger/10 text-danger";
}

function InsightRow({ insight }: { insight: InsightScore }) {
  return (
    <article className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-bold text-ink">{insight.label}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{insight.detail}</p>
        </div>
        <span className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-bold ${scoreTone(insight.status)}`}>
          {insight.score}/10
        </span>
      </div>
      <ul className="mt-3 space-y-1 text-sm leading-6 text-muted">
        {insight.inputs.map((input) => (
          <li key={input}>- {input}</li>
        ))}
      </ul>
    </article>
  );
}

export function BudgetDashboard() {
  const { trip, hasHydrated } = useTrip();
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const summary = useMemo(() => calculateBudget(trip), [trip]);
  const destination = useMemo(
    () => getDestinationById(trip.destinationId) ?? destinations[0],
    [trip.destinationId],
  );
  const insights = useMemo(
    () => calculateTripInsights(trip, destination),
    [destination, trip],
  );

  async function shareDashboard() {
    try {
      await navigator.clipboard.writeText(createTripShareSummary(trip, destination));
      setShareStatus("Trip summary copied to clipboard.");
    } catch {
      setShareStatus("Clipboard access was blocked. Try again from a secure browser context.");
    }
  }

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="editorial-label text-accent">{destination.name} insights</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-ink md:text-5xl">
              {trip.title} insights
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
              Explainable budget, pace, and logistics scoring for {destination.name}. Every score shows the inputs behind it.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Link
              href="/workspace"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-bold text-ink transition hover:-translate-y-px hover:border-accent hover:bg-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:bg-panel dark:hover:bg-surface"
            >
              Workspace
            </Link>
            <Button type="button" variant="secondary" className="gap-2" onClick={shareDashboard}>
              <Share2 className="size-4" aria-hidden="true" />
              Share Dashboard
            </Button>
          </div>
        </div>

        {!hasHydrated ? (
          <div className="mb-4">
            <StatusMessage tone="info">Loading saved budget details...</StatusMessage>
          </div>
        ) : null}
        {shareStatus ? (
          <div className="mb-4">
            <StatusMessage tone={shareStatus.includes("blocked") ? "error" : "success"}>
              {shareStatus}
            </StatusMessage>
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-5">
            <BudgetSummaryCard summary={summary} currency={trip.currency} travelers={trip.travelers} />
            <BudgetCategoryList summary={summary} currency={trip.currency} updatedAt={trip.updatedAt} />
            <section className="motion-panel rounded-2xl border border-line bg-panel-raised p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold tracking-[-0.01em] text-ink">Trip insights</h2>
                  <p className="mt-1 text-sm leading-6 text-muted">{insights.valueScore.detail}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Value</p>
                  <p className="text-3xl font-extrabold leading-none tracking-[-0.02em] text-accent tabular-nums">
                    {insights.valueScore.score}
                  </p>
                </div>
              </div>
              <div className="mt-5 divide-y divide-line border-t border-line">
                <InsightRow insight={insights.budgetHealth} />
                <InsightRow insight={insights.paceScore} />
                <InsightRow insight={insights.logisticsRisk} />
                <InsightRow insight={insights.conflictLoad} />
                <InsightRow insight={insights.valueScore} />
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:h-fit">
            <section className="motion-panel rounded-2xl border border-line bg-panel-raised p-5">
              <p className="text-sm font-bold text-accent">Recommendations</p>
              <div className="mt-4 divide-y divide-line">
                {insights.recommendations.map((item) => (
                  <article key={item.id} className="py-4 first:pt-0 last:pb-0">
                    <p className="font-bold text-ink">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="motion-panel overflow-hidden rounded-2xl border border-line bg-panel-raised">
              <div className="relative aspect-[4/3]">
                <Image
                  src={destination.imageSrc}
                  alt={destination.imageAlt}
                  fill
                  preload
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 24rem, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-muted">Travelers</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-2xl font-bold text-ink">
                    <UsersRound className="size-5 text-accent" aria-hidden="true" />
                    {trip.travelers}
                  </span>
                  <Link
                    href="/itinerary"
                    className="inline-flex min-h-11 items-center text-sm font-bold text-accent transition hover:text-ink"
                  >
                    Edit in trip settings
                  </Link>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
