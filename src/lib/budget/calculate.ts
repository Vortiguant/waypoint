import type { BudgetSummary, Trip } from "@/types/travel";

const categoryOrder = [
  "transport",
  "lodging",
  "food",
  "activity",
  "shopping",
  "other",
] as const;

export function calculateBudget(trip: Trip): BudgetSummary {
  const totals = new Map<(typeof categoryOrder)[number], number>(
    categoryOrder.map((category) => [category, 0]),
  );

  const totalCost = trip.days.reduce(
    (tripTotal, day) =>
      tripTotal +
      day.activities.reduce((dayTotal, activity) => {
        const safeCost = Number.isFinite(activity.cost) ? activity.cost : 0;
        totals.set(activity.category, (totals.get(activity.category) ?? 0) + safeCost);
        return dayTotal + safeCost;
      }, 0),
    0,
  );

  const travelers = Math.max(1, trip.travelers);

  return {
    totalCost,
    perTravelerCost: totalCost / travelers,
    byCategory: categoryOrder.map((category) => ({
      category,
      total: totals.get(category) ?? 0,
    })),
  };
}
