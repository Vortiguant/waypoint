"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { destinations } from "@/lib/data/mock-destinations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { PacePreference, Trip } from "@/types/travel";

type TripSettingsValues = {
  title: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  travelers: string;
  currency: string;
  budgetTarget: string;
  pacePreference: PacePreference;
  planningNotes: string;
};

function valuesFromTrip(trip: Trip): TripSettingsValues {
  return {
    title: trip.title,
    destinationId: trip.destinationId,
    startDate: trip.startDate ?? "",
    endDate: trip.endDate ?? "",
    travelers: String(trip.travelers),
    currency: trip.currency,
    budgetTarget: trip.budgetTarget === undefined ? "" : String(trip.budgetTarget),
    pacePreference: trip.pacePreference,
    planningNotes: trip.planningNotes ?? "",
  };
}

export function TripSettingsForm({
  trip,
  onSave,
}: {
  trip: Trip;
  onSave: (settings: {
    title: string;
    destinationId: string;
    startDate?: string;
    endDate?: string;
    travelers: number;
    currency: string;
    budgetTarget?: number;
    pacePreference: PacePreference;
    planningNotes?: string;
  }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState(() => valuesFromTrip(trip));

  function update<Value extends keyof TripSettingsValues>(
    key: Value,
    value: TripSettingsValues[Value],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="motion-panel rounded-2xl border border-line bg-panel-raised p-5">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 text-left"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span>
          <span className="text-sm font-semibold text-accent">Trip settings</span>
          <span className="mt-2 block font-serif text-2xl font-semibold text-ink">
            Dates, target, pace, and notes
          </span>
        </span>
        <span className="inline-grid size-11 shrink-0 place-items-center rounded-lg border border-line bg-surface text-accent transition-transform duration-200 ease-[var(--ease-out)]">
          <Settings2 className="size-4" aria-hidden="true" />
        </span>
      </button>

      {isOpen ? (
        <form
          className="motion-status mt-6 grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSave({
              title: values.title.trim() || trip.title,
              destinationId: values.destinationId,
              startDate: values.startDate || undefined,
              endDate: values.endDate || undefined,
              travelers: Math.max(1, Number.parseInt(values.travelers, 10) || 1),
              currency: values.currency,
              budgetTarget: values.budgetTarget
                ? Math.max(0, Number.parseFloat(values.budgetTarget))
                : undefined,
              pacePreference: values.pacePreference,
              planningNotes: values.planningNotes.trim() || undefined,
            });
          }}
        >
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-muted">Trip title</span>
            <Input value={values.title} onChange={(event) => update("title", event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-muted">Destination</span>
            <Select
              value={values.destinationId}
              onChange={(event) => update("destinationId", event.target.value)}
            >
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.name}, {destination.country}
                </option>
              ))}
            </Select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-muted">Start date</span>
            <Input
              type="date"
              value={values.startDate}
              onChange={(event) => update("startDate", event.target.value)}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-muted">End date</span>
            <Input
              type="date"
              value={values.endDate}
              onChange={(event) => update("endDate", event.target.value)}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-muted">Travelers</span>
            <Input
              type="number"
              min="1"
              value={values.travelers}
              onChange={(event) => update("travelers", event.target.value)}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-muted">Currency</span>
            <Select value={values.currency} onChange={(event) => update("currency", event.target.value)}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </Select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-muted">Budget target</span>
            <Input
              type="number"
              min="0"
              placeholder="Optional"
              value={values.budgetTarget}
              onChange={(event) => update("budgetTarget", event.target.value)}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-muted">Pace</span>
            <Select
              value={values.pacePreference}
              onChange={(event) => update("pacePreference", event.target.value as PacePreference)}
            >
              <option value="relaxed">Relaxed</option>
              <option value="balanced">Balanced</option>
              <option value="packed">Packed</option>
            </Select>
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-semibold text-muted">Planning notes</span>
            <textarea
              className="min-h-28 w-full rounded-lg border border-line bg-surface px-3.5 py-3 text-sm text-ink outline-none transition-[border-color,box-shadow,transform] duration-200 ease-[var(--ease-out)] placeholder:text-soft focus:-translate-y-px focus:border-accent focus:ring-2 focus:ring-accent/20 dark:bg-panel"
              value={values.planningNotes}
              onChange={(event) => update("planningNotes", event.target.value)}
            />
          </label>
          <div className="md:col-span-2">
            <Button type="submit">Save trip settings</Button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
