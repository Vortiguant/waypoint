import { calculateBudget } from "@/lib/budget/calculate";
import { formatCurrency } from "@/lib/utils";
import type { Destination, Trip } from "@/types/travel";

function dateRange(trip: Trip) {
  if (trip.startDate && trip.endDate) return `${trip.startDate} to ${trip.endDate}`;
  if (trip.startDate) return `Starting ${trip.startDate}`;
  return "Dates not set";
}

export function createTripShareSummary(trip: Trip, destination?: Destination) {
  const summary = calculateBudget(trip);
  const destinationLabel = destination
    ? `${destination.name}, ${destination.country}`
    : trip.destinationId;

  const lines = [
    `${trip.title}`,
    `${destinationLabel} | ${dateRange(trip)}`,
    `${trip.travelers} ${trip.travelers === 1 ? "traveler" : "travelers"} | ${formatCurrency(summary.totalCost, trip.currency)} planned total`,
    "",
    "Itinerary",
    ...trip.days.flatMap((day) => [
      `${day.dateLabel}: ${day.title}`,
      ...day.activities.map((activity) => {
        const time =
          activity.startTime && activity.endTime
            ? `${activity.startTime}-${activity.endTime}`
            : "Flexible";
        return `- ${time} | ${activity.title} at ${activity.location}`;
      }),
    ]),
  ];

  if (trip.planningNotes) {
    lines.push("", "Planning notes", trip.planningNotes);
  }

  return lines.join("\n");
}
