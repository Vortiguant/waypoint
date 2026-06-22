import { describe, expect, it } from "vitest";
import { destinations } from "@/lib/data/mock-destinations";
import {
  calculateTripReadiness,
  getTripNextActions,
  groupSpatialAnchorsByDay,
} from "@/lib/workspace/readiness";
import type { Trip } from "@/types/travel";

const destination = destinations[0];

const completeTrip: Trip = {
  id: "workspace-trip",
  title: "Workspace Trip",
  destinationId: destination.id,
  startDate: "2026-10-14",
  travelers: 2,
  currency: "USD",
  budgetTarget: 500,
  pacePreference: "balanced",
  planningNotes: "",
  packingItems: [
    { id: "pack-1", label: "Shoes", category: "clothing", packed: true },
    { id: "pack-2", label: "Passport copy", category: "documents", packed: true },
  ],
  documents: [
    { id: "doc-1", label: "Passport", status: "ready", notes: "" },
    { id: "doc-2", label: "Hotel confirmation", status: "ready", notes: "" },
  ],
  pinnedDecisions: [
    { id: "decision-1", title: "Dinner seating", status: "decided", notes: "" },
  ],
  spatialAnchors: [
    {
      id: "anchor-1",
      title: "Hotel",
      location: "Higashiyama",
      category: "stay",
      dayId: "day-1",
    },
    {
      id: "anchor-2",
      title: "Market",
      location: "Nishiki",
      category: "food",
    },
  ],
  updatedAt: "2026-06-10T00:00:00.000Z",
  days: [
    {
      id: "day-1",
      dateLabel: "Day 1",
      title: "Arrival",
      activities: [
        {
          id: "a1",
          title: "Check in",
          location: "Hotel",
          notes: "",
          startTime: "14:00",
          endTime: "15:00",
          cost: 120,
          category: "lodging",
        },
        {
          id: "a2",
          title: "Dinner",
          location: "Market",
          notes: "",
          startTime: "18:00",
          endTime: "20:00",
          cost: 80,
          category: "food",
        },
      ],
    },
  ],
};

describe("workspace readiness", () => {
  it("scores a complete trip as ready", () => {
    const readiness = calculateTripReadiness(completeTrip, destination);

    expect(readiness.score).toBeGreaterThanOrEqual(8);
    expect(readiness.status).toBe("good");
    expect(readiness.counts.packedItems).toBe(2);
    expect(readiness.inputs.map((input) => input.label)).toContain("Document readiness");
    expect(readiness.inputs.map((input) => input.label)).toContain("Spatial anchors");
  });

  it("scores partial prep lower than complete prep", () => {
    const partialTrip: Trip = {
      ...completeTrip,
      packingItems: completeTrip.packingItems.map((item) => ({ ...item, packed: false })),
      documents: completeTrip.documents.map((document) => ({
        ...document,
        status: "needed",
      })),
      pinnedDecisions: completeTrip.pinnedDecisions.map((decision) => ({
        ...decision,
        status: "open",
      })),
      spatialAnchors: [],
    };

    expect(calculateTripReadiness(partialTrip, destination).score).toBeLessThan(
      calculateTripReadiness(completeTrip, destination).score,
    );
  });

  it("creates next actions for missing target, conflicts, unpacked items, and incomplete documents", () => {
    const riskyTrip: Trip = {
      ...completeTrip,
      budgetTarget: undefined,
      packingItems: [{ ...completeTrip.packingItems[0], packed: false }],
      documents: [{ ...completeTrip.documents[0], status: "missing" }],
      pinnedDecisions: [{ ...completeTrip.pinnedDecisions[0], status: "watch" }],
      spatialAnchors: [],
      days: [
        {
          ...completeTrip.days[0],
          activities: [
            completeTrip.days[0].activities[0],
            {
              ...completeTrip.days[0].activities[1],
              startTime: "14:30",
              endTime: "16:00",
            },
          ],
        },
      ],
    };
    const actions = getTripNextActions(riskyTrip, destination).map((item) => item.id);

    expect(actions).toContain("set-budget-target");
    expect(actions).toContain("resolve-schedule-conflicts");
    expect(actions).toContain("finish-documents");
    expect(actions).toContain("pack-remaining-items");
    expect(actions).toContain("settle-pinned-decisions");
    expect(actions).toHaveLength(5);
  });

  it("prioritizes earlier readiness actions when more than five are available", () => {
    const riskyTrip: Trip = {
      ...completeTrip,
      budgetTarget: undefined,
      packingItems: [{ ...completeTrip.packingItems[0], packed: false }],
      documents: [{ ...completeTrip.documents[0], status: "missing" }],
      pinnedDecisions: [{ ...completeTrip.pinnedDecisions[0], status: "watch" }],
      spatialAnchors: [],
      days: [
        {
          ...completeTrip.days[0],
          activities: [
            completeTrip.days[0].activities[0],
            {
              ...completeTrip.days[0].activities[1],
              startTime: "14:30",
              endTime: "16:00",
            },
          ],
        },
      ],
    };

    expect(getTripNextActions(riskyTrip, destination).map((item) => item.id)).not.toContain(
      "add-spatial-anchor",
    );
  });

  it("suggests adding a spatial anchor when higher-priority gaps are resolved", () => {
    const trip: Trip = {
      ...completeTrip,
      spatialAnchors: [],
    };

    expect(getTripNextActions(trip, destination).map((item) => item.id)).toContain(
      "add-spatial-anchor",
    );
  });

  it("returns ready-to-travel when all inputs are in range", () => {
    const actions = getTripNextActions(completeTrip, destination);

    expect(actions).toHaveLength(1);
    expect(actions[0].id).toBe("ready-to-travel");
  });

  it("computes a deterministic readiness score for a complete trip", () => {
    const readiness = calculateTripReadiness(completeTrip, destination);

    expect(readiness.score).toBe(9.6);
  });

  it("groups spatial anchors by itinerary day with unassigned fallback", () => {
    const groups = groupSpatialAnchorsByDay(completeTrip);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({ dayId: "day-1" });
    expect(groups[1].label).toBe("Unassigned anchors");
  });

  it("places orphan day ids in the unassigned group", () => {
    const trip: Trip = {
      ...completeTrip,
      spatialAnchors: [
        {
          id: "anchor-orphan",
          title: "Lost stop",
          location: "Nowhere",
          category: "other",
          dayId: "missing-day",
        },
      ],
    };

    const groups = groupSpatialAnchorsByDay(trip);

    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe("Unassigned anchors");
    expect(groups[0].anchors).toHaveLength(1);
  });
});
