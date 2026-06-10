"use client";

import { useMemo, useState } from "react";
import type { Activity } from "@/types/travel";
import { Button } from "@/components/ui/button";
import { DayColumn } from "@/components/itinerary/day-column";
import { StatusMessage } from "@/components/ui/status-message";
import { findScheduleConflicts } from "@/lib/itinerary/conflicts";
import { useTrip } from "@/store/trip-store";

export function ItineraryBoard() {
  const { trip, hasHydrated, storageError, dispatch } = useTrip();
  const [notice, setNotice] = useState<string | null>(null);
  const conflicts = useMemo(() => findScheduleConflicts(trip.days), [trip.days]);

  function showNotice(message: string) {
    setNotice(message);
  }

  function addActivity(dayId: string, activity: Activity) {
    dispatch({ type: "addActivity", dayId, activity });
    showNotice("Activity added to the itinerary.");
  }

  function updateActivity(dayId: string, activity: Activity) {
    dispatch({ type: "updateActivity", dayId, activity });
    showNotice("Activity details saved.");
  }

  function deleteActivity(dayId: string, activityId: string) {
    dispatch({ type: "deleteActivity", dayId, activityId });
    showNotice("Activity deleted.");
  }

  function reorderActivity(dayId: string, activityId: string, direction: "up" | "down") {
    dispatch({ type: "reorderActivity", dayId, activityId, direction });
    showNotice("Activity order updated.");
  }

  function moveActivity(fromDayId: string, toDayId: string, activityId: string) {
    dispatch({ type: "moveActivity", fromDayId, toDayId, activityId });
    showNotice("Activity moved to another day.");
  }

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 border-b border-line pb-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-accent">Itinerary desk</p>
            <h1 className="mt-3 font-serif text-5xl font-semibold leading-[0.96] tracking-[-0.025em] text-ink md:text-6xl">
              {trip.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
              Build each day with keyboard-friendly controls. Conflicts appear as soon as timed plans overlap.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <p className="text-sm leading-6 text-muted">
              {trip.days.length} days · {conflicts.length} active {conflicts.length === 1 ? "conflict" : "conflicts"}
            </p>
            <Button type="button" variant="secondary" onClick={() => {
              dispatch({ type: "resetTrip" });
              showNotice("Sample trip restored.");
            }}>
              Reset sample
            </Button>
          </div>
        </div>

        <div className="mt-5 space-y-3" aria-live="polite">
          {!hasHydrated ? <StatusMessage tone="info">Loading saved trip details…</StatusMessage> : null}
          {storageError ? <StatusMessage tone="error">{storageError}</StatusMessage> : null}
          {notice ? <StatusMessage tone="success">{notice}</StatusMessage> : null}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {trip.days.map((day) => (
            <DayColumn
              key={day.id}
              day={day}
              days={trip.days}
              conflicts={conflicts}
              currency={trip.currency}
              onAddActivity={addActivity}
              onUpdateActivity={updateActivity}
              onDeleteActivity={deleteActivity}
              onReorderActivity={reorderActivity}
              onMoveActivity={moveActivity}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
