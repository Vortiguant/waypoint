import { describe, expect, it } from "vitest";
import { exportTripCalendar } from "@/lib/calendar/export";
import type { Trip } from "@/types/travel";

const trip: Trip = {
  id: "calendar-trip",
  title: "Calendar Trip",
  destinationId: "kyoto",
  startDate: "2026-10-14",
  travelers: 2,
  currency: "USD",
  pacePreference: "balanced",
  packingItems: [],
  documents: [],
  pinnedDecisions: [],
  spatialAnchors: [],
  updatedAt: "2026-06-10T00:00:00.000Z",
  days: [
    {
      id: "day-1",
      dateLabel: "Day 1",
      title: "Arrival",
      activities: [
        {
          id: "timed",
          title: "Tea ceremony",
          location: "Temple",
          notes: "Bring socks",
          startTime: "09:00",
          endTime: "10:30",
          cost: 50,
          category: "activity",
        },
        {
          id: "untimed",
          title: "Flexible walk",
          location: "Gion",
          notes: "",
          cost: 0,
          category: "activity",
        },
      ],
    },
  ],
};

describe("exportTripCalendar", () => {
  it("exports only timed itinerary activities", () => {
    const calendar = exportTripCalendar(trip);

    expect(calendar).toContain("BEGIN:VCALENDAR");
    expect(calendar).toContain("SUMMARY:Tea ceremony");
    expect(calendar).toContain("DTSTART:20261014T090000Z");
    expect(calendar).not.toContain("Flexible walk");
  });

  it("returns an empty calendar when the trip has no start date", () => {
    const calendar = exportTripCalendar({ ...trip, startDate: undefined });

    expect(calendar).toContain("BEGIN:VCALENDAR");
    expect(calendar).not.toContain("BEGIN:VEVENT");
  });
});
