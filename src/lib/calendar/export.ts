import type { Activity, Trip } from "@/types/travel";

function escapeText(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

function formatDateTime(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function eventDate(baseDate: Date, dayOffset: number, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = addDays(baseDate, dayOffset);
  date.setUTCHours(hours, minutes, 0, 0);
  return date;
}

function activityToEvent(
  trip: Trip,
  activity: Activity,
  baseDate: Date,
  dayOffset: number,
  stamp: string,
) {
  if (!activity.startTime || !activity.endTime) {
    return null;
  }

  const start = eventDate(baseDate, dayOffset, activity.startTime);
  const end = eventDate(baseDate, dayOffset, activity.endTime);

  if (end <= start) {
    return null;
  }

  return [
    "BEGIN:VEVENT",
    `UID:${escapeText(`${trip.id}-${activity.id}`)}@waypoint.local`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatDateTime(start)}`,
    `DTEND:${formatDateTime(end)}`,
    `SUMMARY:${escapeText(activity.title)}`,
    `LOCATION:${escapeText(activity.location)}`,
    `DESCRIPTION:${escapeText(activity.notes || trip.title)}`,
    "END:VEVENT",
  ].join("\r\n");
}

export function exportTripCalendar(trip: Trip) {
  const baseDate = trip.startDate ? new Date(`${trip.startDate}T00:00:00.000Z`) : null;
  const updatedAt = new Date(trip.updatedAt);
  const stamp = formatDateTime(Number.isNaN(updatedAt.getTime()) ? new Date("1970-01-01T00:00:00.000Z") : updatedAt);

  const events =
    baseDate && !Number.isNaN(baseDate.getTime())
      ? trip.days.flatMap((day, dayIndex) =>
          day.activities
            .map((activity) => activityToEvent(trip, activity, baseDate, dayIndex, stamp))
            .filter((event): event is string => event !== null),
        )
      : [];

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Waypoint//Local Planner//EN",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${escapeText(trip.title)}`,
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}
