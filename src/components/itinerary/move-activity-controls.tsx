"use client";

import type { TripDay } from "@/types/travel";
import { Button } from "@/components/ui/button";

export function MoveActivityControls({
  day,
  days,
  onMove,
}: {
  day: TripDay;
  days: TripDay[];
  onMove: (toDayId: string) => void;
}) {
  const currentIndex = days.findIndex((item) => item.id === day.id);
  const previousDay = days[currentIndex - 1];
  const nextDay = days[currentIndex + 1];

  return (
    <div className="flex flex-wrap gap-2" aria-label="Move activity between days">
      <Button type="button" variant="ghost" className="min-h-8 px-3 py-1 text-xs" disabled={!previousDay} onClick={() => previousDay && onMove(previousDay.id)}>
        Previous day
      </Button>
      <Button type="button" variant="ghost" className="min-h-8 px-3 py-1 text-xs" disabled={!nextDay} onClick={() => nextDay && onMove(nextDay.id)}>
        Next day
      </Button>
    </div>
  );
}
