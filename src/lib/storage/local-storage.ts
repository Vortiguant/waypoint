import type { Trip } from "@/types/travel";
import { tripSchema } from "@/lib/validation/schemas";

export const TRIP_STORAGE_KEY = "waypoint.trip.v1";

export function loadStoredTrip(): { trip: Trip | null; error: string | null } {
  if (typeof window === "undefined") {
    return { trip: null, error: null };
  }

  const raw = window.localStorage.getItem(TRIP_STORAGE_KEY);

  if (!raw) {
    return { trip: null, error: null };
  }

  try {
    const parsed = JSON.parse(raw);
    const result = tripSchema.safeParse(parsed);

    if (!result.success) {
      return {
        trip: null,
        error: "Saved trip data was out of date, so Waypoint restored the sample trip.",
      };
    }

    return { trip: result.data, error: null };
  } catch {
    return {
      trip: null,
      error: "Saved trip data could not be read, so Waypoint restored the sample trip.",
    };
  }
}

export function saveStoredTrip(trip: Trip) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(trip));
}
