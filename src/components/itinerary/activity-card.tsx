"use client";

import { useState } from "react";
import { AlertTriangle, Clock, MapPin, Pencil, Trash2 } from "lucide-react";
import type { Activity, TripDay } from "@/types/travel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ActivityForm } from "@/components/itinerary/activity-form";
import { MoveActivityControls } from "@/components/itinerary/move-activity-controls";
import { formatCurrency } from "@/lib/utils";

export function ActivityCard({
  activity,
  day,
  days,
  index,
  totalActivities,
  hasConflict,
  currency,
  onUpdate,
  onDelete,
  onReorder,
  onMove,
}: {
  activity: Activity;
  day: TripDay;
  days: TripDay[];
  index: number;
  totalActivities: number;
  hasConflict: boolean;
  currency: string;
  onUpdate: (activity: Activity) => void;
  onDelete: () => void;
  onReorder: (direction: "up" | "down") => void;
  onMove: (toDayId: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <Card className="border-accent/30 bg-panel p-4">
        <ActivityForm
          activity={activity}
          submitLabel="Save changes"
          onSubmit={(updatedActivity) => {
            onUpdate(updatedActivity);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </Card>
    );
  }

  return (
    <article className="border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-bold text-accent">
              {activity.category}
            </p>
            {hasConflict ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-1 text-xs font-bold text-danger">
                <AlertTriangle className="size-3" aria-hidden="true" /> Conflict
              </span>
            ) : null}
          </div>
          <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-[-0.015em] text-ink">
            {activity.title}
          </h3>
        </div>
        <p className="shrink-0 rounded-full bg-panel px-3 py-1 text-sm font-bold text-ink">
          {formatCurrency(activity.cost, currency)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" aria-hidden="true" />
          {activity.startTime && activity.endTime ? `${activity.startTime}–${activity.endTime}` : "Flexible time"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-4" aria-hidden="true" />
          {activity.location}
        </span>
      </div>

      {activity.notes ? (
        <p className="mt-4 text-sm leading-6 text-muted">{activity.notes}</p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
        <Button type="button" variant="ghost" className="min-h-8 px-3 py-1 text-xs" disabled={index === 0} onClick={() => onReorder("up")}>
          Move up
        </Button>
        <Button type="button" variant="ghost" className="min-h-8 px-3 py-1 text-xs" disabled={index === totalActivities - 1} onClick={() => onReorder("down")}>
          Move down
        </Button>
        <Button type="button" variant="secondary" className="min-h-8 gap-1 px-3 py-1 text-xs" onClick={() => setIsEditing(true)}>
          <Pencil className="size-3" aria-hidden="true" /> Edit
        </Button>
        <Button type="button" variant="danger" className="min-h-8 gap-1 px-3 py-1 text-xs" onClick={onDelete}>
          <Trash2 className="size-3" aria-hidden="true" /> Delete
        </Button>
      </div>

      <div className="mt-3">
        <MoveActivityControls day={day} days={days} onMove={onMove} />
      </div>
    </article>
  );
}
