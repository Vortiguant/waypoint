import type { Trip } from "@/types/travel";
import { tripSchema } from "@/lib/validation/schemas";

export const TRIP_STORAGE_KEY = "waypoint.trip.v2";
export const LEGACY_TRIP_STORAGE_KEY = "waypoint.trip.v1";

function parseStoredTrip(raw: string | null): { trip: Trip | null; unreadable: boolean } {
  if (!raw) {
    return { trip: null, unreadable: false };
  }

  try {
    return { trip: normalizeTrip(JSON.parse(raw)), unreadable: false };
  } catch {
    return { trip: null, unreadable: true };
  }
}

export function normalizeTrip(raw: unknown): Trip | null {
  const result = tripSchema.safeParse(raw);

  if (!result.success) {
    return null;
  }

  const trip = result.data;

  return {
    ...trip,
    startDate: trip.startDate || undefined,
    endDate: trip.endDate || undefined,
    budgetTarget:
      typeof trip.budgetTarget === "number" && Number.isFinite(trip.budgetTarget)
        ? trip.budgetTarget
        : undefined,
    pacePreference: trip.pacePreference ?? "balanced",
    planningNotes: trip.planningNotes ?? "",
  };
}

export function loadStoredTrip(): { trip: Trip | null; error: string | null } {
  if (typeof window === "undefined") {
    return { trip: null, error: null };
  }

  const current = parseStoredTrip(window.localStorage.getItem(TRIP_STORAGE_KEY));

  if (current.trip) {
    return { trip: current.trip, error: null };
  }

  const legacy = parseStoredTrip(window.localStorage.getItem(LEGACY_TRIP_STORAGE_KEY));

  if (legacy.trip) {
    window.localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(legacy.trip));
    return { trip: legacy.trip, error: null };
  }

  if (current.unreadable || legacy.unreadable) {
    return {
      trip: null,
      error: "Saved trip data could not be read, so Waypoint restored the sample trip.",
    };
  }

  if (window.localStorage.getItem(TRIP_STORAGE_KEY) || window.localStorage.getItem(LEGACY_TRIP_STORAGE_KEY)) {
    return {
      trip: null,
      error: "Saved trip data was out of date, so Waypoint restored the sample trip.",
    };
  }

  return { trip: null, error: null };
}

export function saveStoredTrip(trip: Trip) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(trip));
}
