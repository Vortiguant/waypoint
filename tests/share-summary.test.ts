import { describe, expect, it } from "vitest";
import { destinations } from "@/lib/data/mock-destinations";
import { createTripShareSummary } from "@/lib/sharing/trip-summary";
import type { Trip } from "@/types/travel";

describe("createTripShareSummary", () => {
  it("creates a readable local trip summary", () => {
    const trip: Trip = {
      id: "share-trip",
      title: "Share Trip",
      destinationId: "kyoto",
      startDate: "2026-10-14",
      endDate: "2026-10-17",
      travelers: 2,
      currency: "USD",
      pacePreference: "balanced",
      planningNotes: "Keep one quiet afternoon.",
      updatedAt: "2026-06-10T00:00:00.000Z",
      days: [
        {
          id: "day-1",
          dateLabel: "Day 1",
          title: "Arrival",
          activities: [
            {
              id: "a1",
              title: "Dinner",
              location: "Pontocho",
              notes: "",
              startTime: "18:00",
              endTime: "20:00",
              cost: 120,
              category: "food",
            },
          ],
        },
      ],
    };

    const summary = createTripShareSummary(trip, destinations[0]);

    expect(summary).toContain("Share Trip");
    expect(summary).toContain("Kyoto, Japan");
    expect(summary).toContain("18:00-20:00 | Dinner at Pontocho");
    expect(summary).toContain("Keep one quiet afternoon.");
  });
});
