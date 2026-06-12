export type DestinationStyle = "culture" | "adventure" | "relaxation" | "food" | "nature";

export type ActivityCategory =
  | "transport"
  | "lodging"
  | "food"
  | "activity"
  | "shopping"
  | "other";

export type PacePreference = "relaxed" | "balanced" | "packed";

export type Destination = {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  image: string;
  imageSrc: string;
  imageAlt: string;
  heroImageSrc: string;
  heroImageAlt: string;
  editorialTitle: string;
  detailSummary: string;
  detailDescription: string;
  decisions: DestinationDecision[];
  stays: DestinationStay[];
  tags: string[];
  style: DestinationStyle;
  rating: number;
  estimatedDailyCost: number;
  bestMonths: string[];
};

export type DestinationDecision = {
  title: string;
  label: string;
  description: string;
};

export type DestinationStay = {
  name: string;
  tags: string[];
  description: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
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
  startDate?: string;
  endDate?: string;
  travelers: number;
  currency: string;
  budgetTarget?: number;
  pacePreference: PacePreference;
  planningNotes?: string;
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

export type InsightStatus = "good" | "watch" | "risk";

export type InsightScore = {
  label: string;
  score: number;
  status: InsightStatus;
  detail: string;
  inputs: string[];
};

export type InsightRecommendation = {
  id: string;
  tone: "info" | "success" | "warning";
  title: string;
  description: string;
};

export type TripInsights = {
  budgetHealth: InsightScore & {
    totalCost: number;
    target?: number;
    variance?: number;
    dailyAverage: number;
  };
  paceScore: InsightScore & {
    activitiesPerDay: number;
    targetRange: [number, number];
  };
  logisticsRisk: InsightScore & {
    earlyStarts: number;
    tightGaps: number;
    untimedActivities: number;
  };
  conflictLoad: InsightScore & {
    conflictCount: number;
    affectedActivities: number;
  };
  valueScore: InsightScore & {
    destinationRating: number;
  };
  recommendations: InsightRecommendation[];
};
