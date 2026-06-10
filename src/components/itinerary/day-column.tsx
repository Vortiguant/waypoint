"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Activity, ScheduleConflict, TripDay } from "@/types/travel";
import { ActivityCard } from "@/components/itinerary/activity-card";
import { ActivityForm } from "@/components/itinerary/activity-form";
import { ConflictAlert } from "@/components/itinerary/conflict-alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <Card className="flex min-h-full flex-col p-4">
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="text-sm font-semibold text-accent">{day.dateLabel}</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold leading-none tracking-[-0.015em] text-ink">{day.title}</h2>
        </div>
        <Button type="button" variant="secondary" className="min-h-9 gap-1 px-3 py-1 text-xs" onClick={() => setIsAdding((current) => !current)}>
          <Plus className="size-3" aria-hidden="true" /> Add
        </Button>
      </div>

      <ConflictAlert conflicts={dayConflicts} />

      {isAdding ? (
        <div className="mt-4 border border-line bg-panel p-4">
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

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {day.activities.length === 0 ? (
          <EmptyState title="No plans yet" description="Add the first timed or flexible stop for this day." />
        ) : (
          day.activities.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              day={day}
              days={days}
              index={index}
              totalActivities={day.activities.length}
              hasConflict={hasActivityConflict(conflicts, day.id, activity.id)}
              currency={currency}
              onUpdate={(updatedActivity) => onUpdateActivity(day.id, updatedActivity)}
              onDelete={() => onDeleteActivity(day.id, activity.id)}
              onReorder={(direction) => onReorderActivity(day.id, activity.id, direction)}
              onMove={(toDayId) => onMoveActivity(day.id, toDayId, activity.id)}
            />
          ))
        )}
      </div>
    </Card>
  );
}
