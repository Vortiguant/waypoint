import { calculateTripInsights } from "@/lib/insights/calculate";
import { findScheduleConflicts } from "@/lib/itinerary/conflicts";
import type {
  Destination,
  GroupedMapPins,
  InsightScore,
  InsightStatus,
  MapPin,
  Trip,
  TripNextAction,
  TripReadiness,
} from "@/types/travel";

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(10, round(value)));
}

function statusFromScore(score: number): InsightStatus {
  if (score >= 8) return "good";
  if (score >= 5.5) return "watch";
  return "risk";
}

function percentScore(complete: number, total: number, emptyScore = 4) {
  if (total === 0) return emptyScore;
  return clampScore((complete / total) * 10);
}

function scoreInput(
  label: string,
  score: number,
  detail: string,
  inputs: string[],
): InsightScore {
  return {
    label,
    score,
    status: statusFromScore(score),
    detail,
    inputs,
  };
}

function action(
  id: string,
  tone: TripNextAction["tone"],
  title: string,
  description: string,
  href?: string,
): TripNextAction {
  return { id, tone, title, description, href };
}

export function calculateTripReadiness(
  trip: Trip,
  destination: Destination,
): TripReadiness {
  const insights = calculateTripInsights(trip, destination);
  const conflicts = findScheduleConflicts(trip.days);
  const totalActivities = trip.days.reduce((total, day) => total + day.activities.length, 0);
  const timedActivities = trip.days.reduce(
    (total, day) =>
      total +
      day.activities.filter((activity) => activity.startTime && activity.endTime).length,
    0,
  );
  const packedItems = trip.packingItems.filter((item) => item.packed).length;
  const readyDocuments = trip.documents.filter((document) => document.status === "ready").length;
  const decidedPinnedDecisions = trip.pinnedDecisions.filter(
    (decision) => decision.status === "decided",
  ).length;

  const itineraryScore = clampScore(
    percentScore(timedActivities, Math.max(1, totalActivities), totalActivities > 0 ? 6 : 3) -
      conflicts.length * 1.5,
  );
  const packingScore = percentScore(packedItems, trip.packingItems.length);
  const documentScore = percentScore(readyDocuments, trip.documents.length);
  const decisionScore = percentScore(decidedPinnedDecisions, trip.pinnedDecisions.length);
  const mapScore = trip.mapPins.length > 0 ? 10 : 4;
  const budgetScore = insights.budgetHealth.score;

  const inputs: InsightScore[] = [
    scoreInput(
      "Itinerary readiness",
      itineraryScore,
      `${timedActivities} of ${totalActivities} activities have full timing.`,
      [
        `${conflicts.length} schedule conflicts`,
        `${trip.days.length} itinerary days`,
        "Score subtracts 1.5 points per conflict.",
      ],
    ),
    scoreInput(
      "Budget readiness",
      budgetScore,
      insights.budgetHealth.detail,
      insights.budgetHealth.inputs,
    ),
    scoreInput(
      "Packing readiness",
      packingScore,
      `${packedItems} of ${trip.packingItems.length} packing items are checked off.`,
      [
        trip.packingItems.length > 0
          ? `${trip.packingItems.length - packedItems} items remaining`
          : "No packing list yet",
      ],
    ),
    scoreInput(
      "Document readiness",
      documentScore,
      `${readyDocuments} of ${trip.documents.length} documents are ready.`,
      [
        trip.documents.length > 0
          ? `${trip.documents.length - readyDocuments} documents still need attention`
          : "No document checklist yet",
      ],
    ),
    scoreInput(
      "Decision readiness",
      decisionScore,
      `${decidedPinnedDecisions} of ${trip.pinnedDecisions.length} pinned decisions are settled.`,
      [
        trip.pinnedDecisions.length > 0
          ? `${trip.pinnedDecisions.length - decidedPinnedDecisions} decisions still open or under watch`
          : "No pinned decisions yet",
      ],
    ),
    scoreInput(
      "Map context",
      mapScore,
      `${trip.mapPins.length} map-context pins are attached to the plan.`,
      [
        trip.mapPins.length > 0
          ? "Pins help connect errands, stays, transfers, and activities."
          : "Add at least one pin to orient the trip.",
      ],
    ),
  ];

  const score = clampScore(
    itineraryScore * 0.25 +
      budgetScore * 0.2 +
      packingScore * 0.15 +
      documentScore * 0.15 +
      decisionScore * 0.15 +
      mapScore * 0.1,
  );

  return {
    score,
    status: statusFromScore(score),
    label: "Trip readiness",
    detail:
      "Weighted from itinerary timing, budget target, packing, documents, pinned decisions, and map context.",
    inputs,
    counts: {
      packedItems,
      totalPackingItems: trip.packingItems.length,
      readyDocuments,
      totalDocuments: trip.documents.length,
      decidedPinnedDecisions,
      totalPinnedDecisions: trip.pinnedDecisions.length,
      mapPins: trip.mapPins.length,
      conflicts: conflicts.length,
    },
  };
}

export function getTripNextActions(
  trip: Trip,
  destination: Destination,
): TripNextAction[] {
  const insights = calculateTripInsights(trip, destination);
  const readiness = calculateTripReadiness(trip, destination);
  const actions: TripNextAction[] = [];
  const conflicts = readiness.counts.conflicts;
  const unpacked = trip.packingItems.filter((item) => !item.packed);
  const incompleteDocuments = trip.documents.filter((document) => document.status !== "ready");
  const openDecisions = trip.pinnedDecisions.filter(
    (decision) => decision.status !== "decided",
  );

  if (!trip.budgetTarget || trip.budgetTarget <= 0) {
    actions.push(
      action(
        "set-budget-target",
        "warning",
        "Set the budget target",
        "The readiness score needs a target before budget health is reliable.",
        "/itinerary",
      ),
    );
  } else if (insights.budgetHealth.status === "risk") {
    actions.push(
      action(
        "review-budget-risk",
        "warning",
        "Review budget pressure",
        insights.budgetHealth.detail,
        "/budget",
      ),
    );
  }

  if (conflicts > 0) {
    actions.push(
      action(
        "resolve-schedule-conflicts",
        "warning",
        "Resolve schedule conflicts",
        `${conflicts} overlap ${conflicts === 1 ? "is" : "are"} lowering trip readiness.`,
        "/itinerary",
      ),
    );
  }

  if (incompleteDocuments.length > 0) {
    actions.push(
      action(
        "finish-documents",
        "warning",
        "Finish document prep",
        `${incompleteDocuments.length} document ${incompleteDocuments.length === 1 ? "needs" : "need"} attention before departure.`,
      ),
    );
  }

  if (unpacked.length > 0) {
    actions.push(
      action(
        "pack-remaining-items",
        "info",
        "Pack remaining essentials",
        `${unpacked.length} packing item ${unpacked.length === 1 ? "is" : "are"} still unchecked.`,
      ),
    );
  }

  if (openDecisions.length > 0) {
    actions.push(
      action(
        "settle-pinned-decisions",
        "info",
        "Settle pinned decisions",
        `${openDecisions.length} pinned decision ${openDecisions.length === 1 ? "is" : "are"} still open or under watch.`,
      ),
    );
  }

  if (trip.mapPins.length === 0) {
    actions.push(
      action(
        "add-map-context",
        "info",
        "Add map context",
        "Pin the stay, arrival point, or one errand so the trip has spatial anchors.",
      ),
    );
  }

  if (actions.length === 0) {
    actions.push(
      action(
        "ready-to-travel",
        "success",
        "Workspace is travel-ready",
        "Readiness inputs are all in the expected range.",
      ),
    );
  }

  return actions.slice(0, 5);
}

export function groupPinsByDay(trip: Trip): GroupedMapPins[] {
  const groups = new Map<string, { label: string; dayId?: string; pins: MapPin[] }>();

  for (const day of trip.days) {
    groups.set(day.id, { label: `${day.dateLabel}: ${day.title}`, dayId: day.id, pins: [] });
  }

  groups.set("unassigned", { label: "Unassigned pins", pins: [] });

  for (const pin of trip.mapPins) {
    const key = pin.dayId && groups.has(pin.dayId) ? pin.dayId : "unassigned";
    groups.get(key)?.pins.push(pin);
  }

  return [...groups.values()].filter((group) => group.pins.length > 0);
}
