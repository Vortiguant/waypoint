import { z } from "zod";

const activityCategorySchema = z.enum([
  "transport",
  "lodging",
  "food",
  "activity",
  "shopping",
  "other",
]);

const pacePreferenceSchema = z.enum(["relaxed", "balanced", "packed"]);
const packingCategorySchema = z.enum([
  "clothing",
  "documents",
  "health",
  "electronics",
  "comfort",
  "other",
]);
const tripDocumentStatusSchema = z.enum(["missing", "needed", "ready"]);
const tripDecisionStatusSchema = z.enum(["open", "decided", "watch"]);
const mapPinCategorySchema = z.enum([
  "arrival",
  "stay",
  "food",
  "activity",
  "transfer",
  "errand",
  "other",
]);

const optionalDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD date format.")
  .or(z.literal(""))
  .optional();

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

const packingItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  category: packingCategorySchema.default("other"),
  packed: z.boolean().default(false),
});

const tripDocumentSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  status: tripDocumentStatusSchema.default("needed"),
  notes: z.string().optional().default(""),
});

const pinnedDecisionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  status: tripDecisionStatusSchema.default("open"),
  notes: z.string().optional().default(""),
});

const mapPinSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  category: mapPinCategorySchema.default("other"),
  dayId: z.string().or(z.literal("")).optional(),
});

export const tripSchema = z.object({
  id: z.string(),
  title: z.string(),
  destinationId: z.string(),
  startDate: optionalDateSchema,
  endDate: optionalDateSchema,
  travelers: z.number().int().min(1),
  currency: z.string().min(3),
  budgetTarget: z.coerce.number().min(0).optional(),
  pacePreference: pacePreferenceSchema.default("balanced"),
  planningNotes: z.string().optional().default(""),
  packingItems: z.array(packingItemSchema).default([]),
  documents: z.array(tripDocumentSchema).default([]),
  pinnedDecisions: z.array(pinnedDecisionSchema).default([]),
  mapPins: z.array(mapPinSchema).default([]),
  days: z.array(tripDaySchema),
  updatedAt: z.string(),
});

export type ActivityFormInput = z.input<typeof activitySchema>;
