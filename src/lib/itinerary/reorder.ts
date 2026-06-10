import type { TripDay } from "@/types/travel";

export function reorderActivity(
  day: TripDay,
  activityId: string,
  direction: "up" | "down",
): TripDay {
  const currentIndex = day.activities.findIndex((activity) => activity.id === activityId);

  if (currentIndex === -1) {
    return day;
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= day.activities.length) {
    return day;
  }

  const activities = [...day.activities];
  const [activity] = activities.splice(currentIndex, 1);
  activities.splice(targetIndex, 0, activity);

  return { ...day, activities };
}
