import { describe, expect, it } from "vitest";
import { calculateBudget } from "@/lib/budget/calculate";
import type { Trip } from "@/types/travel";

const trip: Trip = {
  id: "test-trip",
  title: "Test Trip",
  destinationId: "kyoto",
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
          id: "food-1",
          title: "Dinner",
          location: "Market",
          notes: "",
          cost: 80,
          category: "food",
        },
        {
          id: "lodging-1",
          title: "Hotel",
          location: "Center",
          notes: "",
          cost: 240,
          category: "lodging",
        },
      ],
    },
    {
      id: "day-2",
      dateLabel: "Day 2",
      title: "Explore",
      activities: [
        {
          id: "activity-1",
          title: "Museum",
          location: "Old town",
          notes: "",
          cost: 40,
          category: "activity",
        },
      ],
    },
  ],
};

describe("calculateBudget", () => {
  it("sums activity costs across days", () => {
    expect(calculateBudget(trip).totalCost).toBe(360);
  });

  it("groups costs by category", () => {
    const summary = calculateBudget(trip);

    expect(summary.byCategory).toContainEqual({ category: "food", total: 80 });
    expect(summary.byCategory).toContainEqual({ category: "lodging", total: 240 });
    expect(summary.byCategory).toContainEqual({ category: "activity", total: 40 });
  });

  it("computes per-traveler cost", () => {
    expect(calculateBudget(trip).perTravelerCost).toBe(180);
  });

  it("guards against invalid traveler counts", () => {
    expect(calculateBudget({ ...trip, travelers: 0 }).perTravelerCost).toBe(360);
  });
});
