"use client";

import { useState } from "react";
import { Check, Plus, TriangleAlert } from "lucide-react";
import type { Activity, ScheduleConflict, TripDay } from "@/types/travel";
import { ActivityCard } from "@/components/itinerary/activity-card";
import { ActivityForm } from "@/components/itinerary/activity-form";
import { ConflictAlert } from "@/components/itinerary/conflict-alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { hasActivityConflict } from "@/lib/itinerary/conflicts";

export function DayColumn({
  day,
  days,
  conflicts,
  currency,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onReorderActivity,
  onMoveActivity,
}: {
  day: TripDay;
  days: TripDay[];
  conflicts: ScheduleConflict[];
  currency: string;
  onAddActivity: (dayId: string, activity: Activity) => void;
  onUpdateActivity: (dayId: string, activity: Activity) => void;
  onDeleteActivity: (dayId: string, activityId: string) => void;
  onReorderActivity: (dayId: string, activityId: string, direction: "up" | "down") => void;
  onMoveActivity: (fromDayId: string, toDayId: string, activityId: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const dayConflicts = conflicts.filter((conflict) => conflict.dayId === day.id);

  return (
    <section className="grid gap-5 md:grid-cols-[7rem_1fr]">
      <div className="md:pt-2">
        <p className="text-sm font-semibold text-accent">{day.dateLabel}</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink">
          {day.title}
        </h2>
        <p className="mt-2 text-sm font-semibold text-muted">
          {day.activities.length} {day.activities.length === 1 ? "activity" : "activities"}
        </p>
      </div>

      <div className="relative md:border-l md:border-line md:pl-9">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ConflictAlert conflicts={dayConflicts} />
          <Button
            type="button"
            variant="secondary"
            className="shrink-0 gap-2"
            onClick={() => setIsAdding((current) => !current)}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add activity
          </Button>
        </div>

        {isAdding ? (
          <div className="motion-panel mb-5 rounded-2xl border border-line bg-panel p-4">
            <ActivityForm
              submitLabel="Add activity"
              onSubmit={(activity) => {
                onAddActivity(day.id, activity);
                setIsAdding(false);
              }}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        ) : null}

        <div className="space-y-5">
          {day.activities.length === 0 ? (
            <EmptyState title="No plans yet" description="Add the first timed or flexible stop for this day." className="p-5" />
          ) : (
            day.activities.map((activity, index) => {
              const activityHasConflict = hasActivityConflict(conflicts, day.id, activity.id);

              return (
                <div key={activity.id} className="relative">
                  <span className="motion-timeline-node absolute -left-[3.75rem] top-8 hidden size-12 place-items-center rounded-full border-2 border-panel-raised bg-surface text-accent md:grid">
                    {activityHasConflict ? (
                      <TriangleAlert className="size-5 text-danger" aria-hidden="true" />
                    ) : (
                      <Check className="size-5 text-positive" aria-hidden="true" />
                    )}
                  </span>
                  <ActivityCard
                    activity={activity}
                    day={day}
                    days={days}
                    index={index}
                    totalActivities={day.activities.length}
                    hasConflict={activityHasConflict}
                    currency={currency}
                    onUpdate={(updatedActivity) => onUpdateActivity(day.id, updatedActivity)}
                    onDelete={() => onDeleteActivity(day.id, activity.id)}
                    onReorder={(direction) => onReorderActivity(day.id, activity.id, direction)}
                    onMove={(toDayId) => onMoveActivity(day.id, toDayId, activity.id)}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
