import { describe, expect, it } from "vitest";
import { findScheduleConflicts } from "@/lib/itinerary/conflicts";
import type { TripDay } from "@/types/travel";

const activity = (id: string, startTime?: string, endTime?: string) => ({
  id,
  title: id,
  location: "Somewhere",
  notes: "",
  startTime,
  endTime,
  cost: 0,
  category: "activity" as const,
});

describe("findScheduleConflicts", () => {
  it("detects overlapping activities on the same day", () => {
    const days: TripDay[] = [
      {
        id: "day-1",
        dateLabel: "Day 1",
        title: "Overlap",
        activities: [activity("a", "09:00", "10:30"), activity("b", "10:00", "11:00")],
      },
    ];

    expect(findScheduleConflicts(days)).toHaveLength(1);
    expect(findScheduleConflicts(days)[0].activityIds).toEqual(["a", "b"]);
  });

  it("does not flag adjacent activities", () => {
    const days: TripDay[] = [
      {
        id: "day-1",
        dateLabel: "Day 1",
        title: "Adjacent",
        activities: [activity("a", "09:00", "10:00"), activity("b", "10:00", "11:00")],
      },
    ];

    expect(findScheduleConflicts(days)).toEqual([]);
  });

  it("ignores overlapping times on separate days", () => {
    const days: TripDay[] = [
      {
        id: "day-1",
        dateLabel: "Day 1",
        title: "First",
        activities: [activity("a", "09:00", "10:00")],
      },
      {
        id: "day-2",
        dateLabel: "Day 2",
        title: "Second",
        activities: [activity("b", "09:30", "10:30")],
      },
    ];

    expect(findScheduleConflicts(days)).toEqual([]);
  });

  it("ignores activities with missing times", () => {
    const days: TripDay[] = [
      {
        id: "day-1",
        dateLabel: "Day 1",
        title: "Flexible",
        activities: [activity("a"), activity("b", "09:30", "10:30")],
      },
    ];

    expect(findScheduleConflicts(days)).toEqual([]);
  });
});
