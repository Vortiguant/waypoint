import { afterEach, describe, expect, it, vi } from "vitest";
import {
  INITIAL_TRIP_STORAGE_KEY,
  LEGACY_TRIP_STORAGE_KEY,
  loadStoredTrip,
  normalizeTrip,
  TRIP_STORAGE_KEY,
} from "@/lib/storage/local-storage";

const legacyTrip = {
  id: "legacy-trip",
  title: "Legacy Trip",
  destinationId: "kyoto",
  travelers: 2,
  currency: "USD",
  updatedAt: "2026-06-10T00:00:00.000Z",
  days: [
    {
      id: "day-1",
      dateLabel: "Day 1",
      title: "Arrival",
      activities: [],
    },
  ],
};

function installLocalStorage() {
  const store = new Map<string, string>();
  const localStorage = {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
  };

  vi.stubGlobal("window", { localStorage });
  return localStorage;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("local storage migration", () => {
  it("normalizes older trips with v3 defaults", () => {
    const trip = normalizeTrip(legacyTrip);

    expect(trip?.pacePreference).toBe("balanced");
    expect(trip?.planningNotes).toBe("");
    expect(trip?.packingItems).toEqual([]);
    expect(trip?.documents).toEqual([]);
    expect(trip?.pinnedDecisions).toEqual([]);
    expect(trip?.mapPins).toEqual([]);
    expect(trip?.title).toBe("Legacy Trip");
  });

  it("loads legacy v2 data and saves the migrated v3 key", () => {
    const localStorage = installLocalStorage();
    localStorage.setItem(LEGACY_TRIP_STORAGE_KEY, JSON.stringify(legacyTrip));

    const result = loadStoredTrip();

    expect(result.trip?.id).toBe("legacy-trip");
    expect(result.error).toBeNull();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      TRIP_STORAGE_KEY,
      expect.stringContaining('"pacePreference":"balanced"'),
    );
  });

  it("loads legacy v1 data when no v2 trip exists", () => {
    const localStorage = installLocalStorage();
    localStorage.setItem(INITIAL_TRIP_STORAGE_KEY, JSON.stringify(legacyTrip));

    const result = loadStoredTrip();

    expect(result.trip?.id).toBe("legacy-trip");
    expect(result.trip?.packingItems).toEqual([]);
    expect(result.error).toBeNull();
  });
});
