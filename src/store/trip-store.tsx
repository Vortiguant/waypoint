"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { mockTrip } from "@/lib/data/mock-trip";
import { reorderActivity } from "@/lib/itinerary/reorder";
import { loadStoredTrip, saveStoredTrip } from "@/lib/storage/local-storage";
import type { Activity, Trip } from "@/types/travel";

type TripSettings = Pick<
  Trip,
  | "title"
  | "destinationId"
  | "startDate"
  | "endDate"
  | "travelers"
  | "currency"
  | "budgetTarget"
  | "pacePreference"
  | "planningNotes"
>;

type TripAction =
  | { type: "hydrate"; trip: Trip }
  | { type: "addActivity"; dayId: string; activity: Activity }
  | { type: "updateActivity"; dayId: string; activity: Activity }
  | { type: "deleteActivity"; dayId: string; activityId: string }
  | { type: "restoreActivity"; dayId: string; activity: Activity; index: number }
  | { type: "reorderActivity"; dayId: string; activityId: string; direction: "up" | "down" }
  | { type: "moveActivity"; fromDayId: string; toDayId: string; activityId: string }
  | { type: "updateTripSettings"; settings: Partial<TripSettings> }
  | { type: "setTravelers"; travelers: number }
  | { type: "resetTrip" };

type TripContextValue = {
  trip: Trip;
  hasHydrated: boolean;
  storageError: string | null;
  dispatch: React.Dispatch<TripAction>;
};

type HydrationState = {
  hasHydrated: boolean;
  storageError: string | null;
};

type HydrationAction = {
  type: "complete";
  error: string | null;
};

const TripContext = createContext<TripContextValue | null>(null);

function withTimestamp(trip: Trip): Trip {
  return { ...trip, updatedAt: new Date().toISOString() };
}

function tripReducer(trip: Trip, action: TripAction): Trip {
  switch (action.type) {
    case "hydrate":
      return action.trip;
    case "addActivity":
      return withTimestamp({
        ...trip,
        days: trip.days.map((day) =>
          day.id === action.dayId
            ? { ...day, activities: [...day.activities, action.activity] }
            : day,
        ),
      });
    case "updateActivity":
      return withTimestamp({
        ...trip,
        days: trip.days.map((day) =>
          day.id === action.dayId
            ? {
                ...day,
                activities: day.activities.map((activity) =>
                  activity.id === action.activity.id ? action.activity : activity,
                ),
              }
            : day,
        ),
      });
    case "deleteActivity":
      return withTimestamp({
        ...trip,
        days: trip.days.map((day) =>
          day.id === action.dayId
            ? {
                ...day,
                activities: day.activities.filter(
                  (activity) => activity.id !== action.activityId,
                ),
              }
            : day,
        ),
      });
    case "restoreActivity":
      return withTimestamp({
        ...trip,
        days: trip.days.map((day) => {
          if (day.id !== action.dayId) {
            return day;
          }

          const nextActivities = [...day.activities];
          nextActivities.splice(action.index, 0, action.activity);
          return { ...day, activities: nextActivities };
        }),
      });
    case "reorderActivity":
      return withTimestamp({
        ...trip,
        days: trip.days.map((day) =>
          day.id === action.dayId
            ? reorderActivity(day, action.activityId, action.direction)
            : day,
        ),
      });
    case "moveActivity": {
      const sourceDay = trip.days.find((day) => day.id === action.fromDayId);
      const activity = sourceDay?.activities.find(
        (item) => item.id === action.activityId,
      );

      if (!activity || action.fromDayId === action.toDayId) {
        return trip;
      }

      return withTimestamp({
        ...trip,
        days: trip.days.map((day) => {
          if (day.id === action.fromDayId) {
            return {
              ...day,
              activities: day.activities.filter((item) => item.id !== action.activityId),
            };
          }

          if (day.id === action.toDayId) {
            return { ...day, activities: [...day.activities, activity] };
          }

          return day;
        }),
      });
    }
    case "updateTripSettings": {
      const hasBudgetTarget = Object.prototype.hasOwnProperty.call(
        action.settings,
        "budgetTarget",
      );

      return withTimestamp({
        ...trip,
        ...action.settings,
        travelers:
          action.settings.travelers === undefined
            ? trip.travelers
            : Math.max(1, action.settings.travelers),
        budgetTarget: hasBudgetTarget
          ? action.settings.budgetTarget === undefined ||
            Number.isNaN(action.settings.budgetTarget)
            ? undefined
            : Math.max(0, action.settings.budgetTarget)
          : trip.budgetTarget,
      });
    }
    case "setTravelers":
      return withTimestamp({ ...trip, travelers: Math.max(1, action.travelers) });
    case "resetTrip":
      return withTimestamp(mockTrip);
    default:
      return trip;
  }
}

function hydrationReducer(
  hydration: HydrationState,
  action: HydrationAction,
): HydrationState {
  switch (action.type) {
    case "complete":
      return { hasHydrated: true, storageError: action.error };
    default:
      return hydration;
  }
}

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trip, dispatch] = useReducer(tripReducer, mockTrip);
  const [hydration, dispatchHydration] = useReducer(hydrationReducer, {
    hasHydrated: false,
    storageError: null,
  });

  useEffect(() => {
    const { trip: storedTrip, error } = loadStoredTrip();

    if (storedTrip) {
      dispatch({ type: "hydrate", trip: storedTrip });
    }

    dispatchHydration({ type: "complete", error });
  }, []);

  useEffect(() => {
    if (hydration.hasHydrated) {
      saveStoredTrip(trip);
    }
  }, [hydration.hasHydrated, trip]);

  const value = useMemo(
    () => ({
      trip,
      hasHydrated: hydration.hasHydrated,
      storageError: hydration.storageError,
      dispatch,
    }),
    [hydration.hasHydrated, hydration.storageError, trip],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);

  if (!context) {
    throw new Error("useTrip must be used within TripProvider");
  }

  return context;
}
