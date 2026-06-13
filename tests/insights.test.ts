import { describe, expect, it } from "vitest";
import { destinations } from "@/lib/data/mock-destinations";
import { calculateTripInsights } from "@/lib/insights/calculate";
import type { Trip } from "@/types/travel";

const destination = destinations[0];

const baseTrip: Trip = {
  id: "insight-trip",
  title: "Insight Trip",
  destinationId: destination.id,
  startDate: "2026-10-14",
  travelers: 2,
  currency: "USD",
  budgetTarget: 500,
  pacePreference: "balanced",
  packingItems: [],
  documents: [],
  pinnedDecisions: [],
  mapPins: [],
  updatedAt: "2026-06-10T00:00:00.000Z",
  days: [
    {
      id: "day-1",
      dateLabel: "Day 1",
      title: "Arrival",
      activities: [
        {
          id: "a1",
          title: "Early train",
          location: "Station",
          notes: "",
          startTime: "06:30",
          endTime: "08:00",
          cost: 80,
          category: "transport",
        },
        {
          id: "a2",
          title: "Breakfast",
          location: "Cafe",
          notes: "",
          startTime: "08:20",
          endTime: "09:00",
          cost: 40,
          category: "food",
        },
      ],
    },
    {
      id: "day-2",
      dateLabel: "Day 2",
      title: "Explore",
      activities: [
        {
          id: "a3",
          title: "Museum",
          location: "Center",
          notes: "",
          startTime: "10:00",
          endTime: "12:00",
          cost: 60,
          category: "activity",
        },
        {
          id: "a4",
          title: "Dinner",
          location: "Market",
          notes: "",
          cost: 100,
          category: "food",
        },
      ],
    },
  ],
};

describe("calculateTripInsights", () => {
  it("scores budget target under, over, and missing cases", () => {
    expect(calculateTripInsights(baseTrip, destination).budgetHealth.status).toBe("good");

    const over = calculateTripInsights({ ...baseTrip, budgetTarget: 120 }, destination);
    expect(over.budgetHealth.status).toBe("risk");
    expect(over.recommendations.some((item) => item.id === "reduce-budget")).toBe(true);

    const missing = calculateTripInsights(
      { ...baseTrip, budgetTarget: undefined },
      destination,
    );
    expect(missing.budgetHealth.status).toBe("watch");
    expect(missing.recommendations.some((item) => item.id === "set-budget-target")).toBe(true);
  });

  it("scores pace against relaxed, balanced, and packed preferences", () => {
    expect(calculateTripInsights({ ...baseTrip, pacePreference: "relaxed" }, destination).paceScore.status).toBe("good");
    expect(calculateTripInsights({ ...baseTrip, pacePreference: "balanced" }, destination).paceScore.status).toBe("good");
    expect(calculateTripInsights({ ...baseTrip, pacePreference: "packed" }, destination).paceScore.status).toBe("watch");
  });

  it("counts logistics risk from early starts, tight gaps, and missing times", () => {
    const insights = calculateTripInsights(baseTrip, destination);

    expect(insights.logisticsRisk.earlyStarts).toBe(1);
    expect(insights.logisticsRisk.tightGaps).toBe(1);
    expect(insights.logisticsRisk.untimedActivities).toBe(1);
  });

  it("counts conflicts and clamps value score to 0-10", () => {
    const conflictTrip: Trip = {
      ...baseTrip,
      budgetTarget: 10,
      days: [
        {
          ...baseTrip.days[0],
          activities: [
            baseTrip.days[0].activities[0],
            {
              ...baseTrip.days[0].activities[1],
              startTime: "07:00",
              endTime: "08:30",
            },
          ],
        },
      ],
    };
    const insights = calculateTripInsights(conflictTrip, destination);

    expect(insights.conflictLoad.conflictCount).toBe(1);
    expect(insights.valueScore.score).toBeGreaterThanOrEqual(0);
    expect(insights.valueScore.score).toBeLessThanOrEqual(10);
    expect(insights.valueScore.inputs.join(" ")).toContain("Budget");
  });
});
