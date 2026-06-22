"use client";

import { useState } from "react";
import { AlertTriangle, Clock, GripVertical, MapPin, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
  const [showMoreActions, setShowMoreActions] = useState(false);
  const tone = hasConflict ? "border-danger/45 bg-danger/5" : "border-line bg-panel-raised";

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
    <article className={`motion-panel rounded-2xl border p-5 ${tone}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className={hasConflict ? "text-xs font-bold text-danger" : "text-xs font-bold text-positive"}>
              {activity.startTime && activity.endTime
                ? `${activity.startTime} - ${hasConflict ? "Scheduling conflict" : "Confirmed"}`
                : "Flexible time"}
            </p>
            {hasConflict ? (
              <span className="inline-flex items-center gap-1 rounded-lg border border-danger/30 bg-danger/10 px-2 py-1 text-xs font-bold text-danger">
                <AlertTriangle className="size-3" aria-hidden="true" /> Conflict
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight tracking-[-0.015em] text-ink">
            {activity.title}
          </h3>
          <p className="mt-2 text-base leading-7 text-muted">{activity.notes}</p>
        </div>
        <p className="shrink-0 rounded-lg bg-panel px-3 py-2 text-sm font-bold text-ink">
          {formatCurrency(activity.cost, currency)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2">
        <span className="inline-flex items-center gap-2">
          <Clock className="size-4 text-accent" aria-hidden="true" />
          {activity.startTime && activity.endTime ? `${activity.startTime}-${activity.endTime}` : "Flexible time"}
        </span>
        <span className="inline-flex items-center gap-2">
          <MapPin className="size-4 text-accent" aria-hidden="true" />
          {activity.location}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <Button type="button" variant="secondary" className="gap-1 px-3 py-1.5 text-xs" onClick={() => setIsEditing(true)}>
          <Pencil className="size-3" aria-hidden="true" /> Edit
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="gap-1 px-3 py-1.5 text-xs"
          aria-expanded={showMoreActions}
          onClick={() => setShowMoreActions((current) => !current)}
        >
          <MoreHorizontal className="size-3" aria-hidden="true" /> More actions
        </Button>
      </div>

      {showMoreActions ? (
        <div className="motion-status mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
          <Button type="button" variant="ghost" className="gap-1 px-3 py-1.5 text-xs" disabled={index === 0} onClick={() => onReorder("up")}>
            <GripVertical className="size-3" aria-hidden="true" /> Move up
          </Button>
          <Button type="button" variant="ghost" className="gap-1 px-3 py-1.5 text-xs" disabled={index === totalActivities - 1} onClick={() => onReorder("down")}>
            <GripVertical className="size-3" aria-hidden="true" /> Move down
          </Button>
          <Button type="button" variant="danger" className="gap-1 px-3 py-1.5 text-xs" onClick={onDelete}>
            <Trash2 className="size-3" aria-hidden="true" /> Delete
          </Button>
        </div>
      ) : null}

      <div className="mt-3">
        <MoveActivityControls day={day} days={days} onMove={onMove} />
      </div>
    </article>
  );
}
