"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BedDouble, CalendarDays, Car, Clock, RotateCcw, Share2, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Activity } from "@/types/travel";
import { Button } from "@/components/ui/button";
import { DayColumn } from "@/components/itinerary/day-column";
import { TripSettingsForm } from "@/components/itinerary/trip-settings-form";
import { StatusMessage } from "@/components/ui/status-message";
import { exportTripCalendar } from "@/lib/calendar/export";
import { getDestinationById } from "@/lib/data/mock-destinations";
import { findScheduleConflicts } from "@/lib/itinerary/conflicts";
import { createTripShareSummary } from "@/lib/sharing/trip-summary";
import { useTrip } from "@/store/trip-store";

type DeletedActivity = {
  dayId: string;
  activity: Activity;
  index: number;
};

export function ItineraryBoard() {
  const { trip, hasHydrated, storageError, dispatch } = useTrip();
  const [notice, setNotice] = useState<string | null>(null);
  const [lastDeleted, setLastDeleted] = useState<DeletedActivity | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const conflicts = useMemo(() => findScheduleConflicts(trip.days), [trip.days]);
  const destination = useMemo(
    () => getDestinationById(trip.destinationId),
    [trip.destinationId],
  );
  const totalActivities = useMemo(
    () => trip.days.reduce((total, day) => total + day.activities.length, 0),
    [trip.days],
  );

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
    const day = trip.days.find((item) => item.id === dayId);
    const index = day?.activities.findIndex((activity) => activity.id === activityId) ?? -1;
    const activity = index >= 0 ? day?.activities[index] : undefined;

    if (day && activity) {
      setLastDeleted({ dayId, activity, index });
    } else {
      setLastDeleted(null);
    }

    dispatch({ type: "deleteActivity", dayId, activityId });
    showNotice("Activity deleted.");
  }

  function undoDelete() {
    if (!lastDeleted) return;
    dispatch({
      type: "restoreActivity",
      dayId: lastDeleted.dayId,
      activity: lastDeleted.activity,
      index: lastDeleted.index,
    });
    setLastDeleted(null);
    showNotice("Activity restored.");
  }

  function reorderActivity(dayId: string, activityId: string, direction: "up" | "down") {
    dispatch({ type: "reorderActivity", dayId, activityId, direction });
    showNotice("Activity order updated.");
  }

  function moveActivity(fromDayId: string, toDayId: string, activityId: string) {
    dispatch({ type: "moveActivity", fromDayId, toDayId, activityId });
    showNotice("Activity moved to another day.");
  }

  function downloadCalendar() {
    if (!trip.startDate) {
      showNotice("Add a start date before exporting a calendar.");
      return;
    }

    const calendar = exportTripCalendar(trip);

    if (!calendar.includes("BEGIN:VEVENT")) {
      showNotice("Add timed activities before exporting a calendar.");
      return;
    }

    const blob = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${trip.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "waypoint-trip"}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
    showNotice("Calendar file downloaded.");
  }

  async function shareTrip() {
    const summary = createTripShareSummary(trip, destination);

    try {
      await navigator.clipboard.writeText(summary);
      showNotice("Trip summary copied to clipboard.");
    } catch {
      showNotice("Clipboard access was blocked. Try again from a secure browser context.");
    }
  }

  const dateRange =
    trip.startDate && trip.endDate
      ? `${trip.startDate} - ${trip.endDate}`
      : trip.startDate
        ? `Starting ${trip.startDate}`
        : "Dates not set";

  const allActivities = trip.days.flatMap((day) => day.activities);
  const lodgingStops = allActivities.filter((activity) => activity.category === "lodging");
  const transportLegs = allActivities.filter((activity) => activity.category === "transport");
  const timedActivities = allActivities.filter(
    (activity) => activity.startTime && activity.endTime,
  ).length;
  const logistics: Array<{ Icon: LucideIcon; title: string; description: string }> = [
    {
      Icon: BedDouble,
      title: lodgingStops.length === 1 ? "1 lodging stop" : `${lodgingStops.length} lodging stops`,
      description: lodgingStops[0]?.location ?? "Add a lodging activity to track stays.",
    },
    {
      Icon: Car,
      title: transportLegs.length === 1 ? "1 transport leg" : `${transportLegs.length} transport legs`,
      description: transportLegs[0]?.location ?? "Add transport activities to track connections.",
    },
    {
      Icon: Clock,
      title: `${timedActivities} of ${totalActivities} activities timed`,
      description:
        timedActivities === totalActivities
          ? "Every activity has a start and end time."
          : "Add times so readiness and conflicts stay accurate.",
    },
  ];
  const lastUpdatedLabel = new Date(trip.updatedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const settingsIncomplete = !trip.startDate || !trip.budgetTarget || !trip.destinationId;

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_28rem]">
          <div>
            <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="editorial-label text-accent">
                  {destination ? `${destination.name}, ${destination.country}` : "Trip planner"}
                </p>
                <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-ink md:text-5xl">
                  {trip.title}
                </h1>
                <p className="mt-4 text-lg leading-7 text-muted">{dateRange}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/workspace"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-bold text-ink transition hover:-translate-y-px hover:border-accent hover:bg-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:bg-panel dark:hover:bg-surface"
                >
                  Workspace
                </Link>
                <Button type="button" variant="secondary" className="gap-2" onClick={downloadCalendar}>
                  <CalendarDays className="size-4" aria-hidden="true" />
                  Calendar
                </Button>
                <Button type="button" variant="secondary" className="gap-2" onClick={shareTrip}>
                  <Share2 className="size-4" aria-hidden="true" />
                  Share
                </Button>
                <Button
                  type="button"
                  variant={confirmingReset ? "danger" : "secondary"}
                  className="gap-2"
                  onClick={() => {
                    if (!confirmingReset) {
                      setConfirmingReset(true);
                      showNotice("Click reset again to replace this trip with the sample trip.");
                      return;
                    }

                    setConfirmingReset(false);
                    setLastDeleted(null);
                    dispatch({ type: "resetTrip" });
                    showNotice("Sample trip restored.");
                  }}
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  {confirmingReset ? "Confirm reset" : "Reset"}
                </Button>
              </div>
            </div>

            <div className="motion-panel mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {[
                ["Days", trip.days.length],
                ["Activities", totalActivities],
                ["Conflicts", conflicts.length],
              ].map(([label, value]) => (
                <div key={label} className="bg-panel-raised p-4">
                  <p className="text-sm font-semibold text-muted">{label}</p>
                  <p className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-ink tabular-nums">{value}</p>
                </div>
              ))}
            </div>

            {conflicts.length > 0 ? (
              <div className="mt-5">
                <StatusMessage tone="error">
                  <span className="flex items-center gap-2 font-bold">
                    <TriangleAlert className="size-4" aria-hidden="true" />
                    {conflicts.length} scheduling {conflicts.length === 1 ? "conflict" : "conflicts"} to resolve
                  </span>
                  <span className="mt-1 block font-semibold">
                    Overlapping timed activities are flagged on their day below.
                  </span>
                </StatusMessage>
              </div>
            ) : null}

            <div className="mt-5 space-y-2" aria-live="polite">
              {!hasHydrated ? <StatusMessage tone="info">Loading saved trip details...</StatusMessage> : null}
              {storageError ? <StatusMessage tone="error">{storageError}</StatusMessage> : null}
              {notice ? (
                <StatusMessage tone={notice.includes("blocked") || notice.includes("Add ") ? "error" : "success"}>
                  <span className="flex flex-wrap items-center justify-between gap-3">
                    <span>{notice}</span>
                    {lastDeleted ? (
                      <button
                        type="button"
                        className="rounded-lg text-sm font-bold underline decoration-current underline-offset-4 transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        onClick={undoDelete}
                      >
                        Undo delete
                      </button>
                    ) : null}
                  </span>
                </StatusMessage>
              ) : null}
            </div>

            <div className="mt-8">
              <TripSettingsForm
                key={[
                  trip.id,
                  trip.title,
                  trip.destinationId,
                  trip.startDate,
                  trip.endDate,
                  trip.travelers,
                  trip.currency,
                  trip.budgetTarget,
                  trip.pacePreference,
                  trip.planningNotes,
                ].join("|")}
                trip={trip}
                defaultOpen={settingsIncomplete}
                onSave={(settings) => {
                  dispatch({ type: "updateTripSettings", settings });
                  showNotice("Trip settings saved.");
                }}
              />
            </div>

            <div className="mt-10 space-y-8">
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

          <aside className="space-y-5 lg:sticky lg:top-28 lg:h-fit">
            <section className="motion-panel overflow-hidden rounded-2xl border border-line bg-panel-raised">
              <div className="h-40 bg-[radial-gradient(circle_at_18%_18%,var(--accent-soft),transparent_34%),linear-gradient(135deg,var(--accent-soft),var(--panel),var(--soft))]" />
              <div className="p-6">
                <h2 className="font-serif text-2xl font-semibold tracking-[-0.02em] text-ink">Trip Logistics</h2>
                <div className="mt-6 space-y-5">
                {logistics.map(({ Icon, title, description }) => (
                    <div key={title} className="flex gap-4">
                      <Icon className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
                      <div>
                        <p className="font-bold text-ink">{title}</p>
                        <p className="mt-1 text-sm text-muted">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="motion-panel rounded-2xl border border-line bg-panel-raised p-6">
              <p className="text-sm font-bold text-accent">Planner notes</p>
              <blockquote className="mt-6 text-lg leading-8 text-ink">
                {trip.planningNotes || "Add notes in trip settings to keep shared context close to the timeline."}
              </blockquote>
              <p className="mt-8 border-t border-line pt-4 text-sm text-muted">
                Last updated {lastUpdatedLabel}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
