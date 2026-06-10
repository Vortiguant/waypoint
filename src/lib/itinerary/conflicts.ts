import type { ScheduleConflict, TripDay } from "@/types/travel";

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

export function findScheduleConflicts(days: TripDay[]): ScheduleConflict[] {
  return days.flatMap((day) => {
    const timedActivities = day.activities
      .map((activity) => {
        if (!activity.startTime || !activity.endTime) {
          return null;
        }

        const start = timeToMinutes(activity.startTime);
        const end = timeToMinutes(activity.endTime);

        if (start === null || end === null || end <= start) {
          return null;
        }

        return { activity, start, end };
      })
      .filter((activity): activity is NonNullable<typeof activity> => activity !== null)
      .sort((a, b) => a.start - b.start);

    const conflicts: ScheduleConflict[] = [];

    for (let i = 0; i < timedActivities.length; i += 1) {
      for (let j = i + 1; j < timedActivities.length; j += 1) {
        const current = timedActivities[i];
        const next = timedActivities[j];

        if (next.start >= current.end) {
          break;
        }

        conflicts.push({
          dayId: day.id,
          activityIds: [current.activity.id, next.activity.id],
          message: `${current.activity.title} overlaps with ${next.activity.title}.`,
        });
      }
    }

    return conflicts;
  });
}

export function hasActivityConflict(
  conflicts: ScheduleConflict[],
  dayId: string,
  activityId: string,
) {
  return conflicts.some(
    (conflict) =>
      conflict.dayId === dayId && conflict.activityIds.includes(activityId),
  );
}
