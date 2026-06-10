export type DestinationStyle = "culture" | "adventure" | "relaxation" | "food" | "nature";

export type ActivityCategory =
  | "transport"
  | "lodging"
  | "food"
  | "activity"
  | "shopping"
  | "other";

export type Destination = {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  image: string;
  tags: string[];
  style: DestinationStyle;
  rating: number;
  estimatedDailyCost: number;
  bestMonths: string[];
};

export type Activity = {
  id: string;
  title: string;
  location: string;
  notes: string;
  startTime?: string;
  endTime?: string;
  cost: number;
  category: ActivityCategory;
};

export type TripDay = {
  id: string;
  dateLabel: string;
  title: string;
  activities: Activity[];
};

export type Trip = {
  id: string;
  title: string;
  destinationId: string;
  travelers: number;
  currency: string;
  days: TripDay[];
  updatedAt: string;
};

export type BudgetCategoryTotal = {
  category: ActivityCategory;
  total: number;
};

export type BudgetSummary = {
  totalCost: number;
  perTravelerCost: number;
  byCategory: BudgetCategoryTotal[];
};

export type ScheduleConflict = {
  dayId: string;
  activityIds: [string, string];
  message: string;
};
