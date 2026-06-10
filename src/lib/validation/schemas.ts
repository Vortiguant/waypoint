import { z } from "zod";

const activityCategorySchema = z.enum([
  "transport",
  "lodging",
  "food",
  "activity",
  "shopping",
  "other",
]);

const optionalTimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM time.")
  .or(z.literal(""))
  .optional();

export const activitySchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(2, "Add a clear activity title."),
    location: z.string().min(2, "Add a location."),
    notes: z.string().optional().default(""),
    startTime: optionalTimeSchema,
    endTime: optionalTimeSchema,
    cost: z.coerce.number().min(0, "Cost cannot be negative."),
    category: activityCategorySchema,
  })
  .refine(
    (activity) => {
      if (!activity.startTime || !activity.endTime) {
        return true;
      }

      return activity.endTime > activity.startTime;
    },
    {
      message: "End time must be after start time.",
      path: ["endTime"],
    },
  );

const tripDaySchema = z.object({
  id: z.string(),
  dateLabel: z.string(),
  title: z.string(),
  activities: z.array(activitySchema),
});

export const tripSchema = z.object({
  id: z.string(),
  title: z.string(),
  destinationId: z.string(),
  travelers: z.number().int().min(1),
  currency: z.string().min(3),
  days: z.array(tripDaySchema),
  updatedAt: z.string(),
});

export type ActivityFormInput = z.input<typeof activitySchema>;
