export type DestinationStyle = "culture" | "adventure" | "relaxation" | "food" | "nature";

export type ActivityCategory =
  | "transport"
  | "lodging"
  | "food"
  | "activity"
  | "shopping"
  | "other";

export type PacePreference = "relaxed" | "balanced" | "packed";

export type PackingCategory =
  | "clothing"
  | "documents"
  | "health"
  | "electronics"
  | "comfort"
  | "other";

export type TripDocumentStatus = "missing" | "needed" | "ready";

export type TripDecisionStatus = "open" | "decided" | "watch";

export type MapPinCategory =
  | "arrival"
  | "stay"
  | "food"
  | "activity"
  | "transfer"
  | "errand"
  | "other";

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

export type PackingItem = {
  id: string;
  label: string;
  category: PackingCategory;
  packed: boolean;
};

export type TripDocument = {
  id: string;
  label: string;
  status: TripDocumentStatus;
  notes?: string;
};

export type PinnedDecision = {
  id: string;
  title: string;
  status: TripDecisionStatus;
  notes?: string;
};

export type MapPin = {
  id: string;
  title: string;
  location: string;
  category: MapPinCategory;
  dayId?: string;
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
  packingItems: PackingItem[];
  documents: TripDocument[];
  pinnedDecisions: PinnedDecision[];
  mapPins: MapPin[];
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

export type TripReadiness = {
  score: number;
  status: InsightStatus;
  label: string;
  detail: string;
  inputs: InsightScore[];
  counts: {
    packedItems: number;
    totalPackingItems: number;
    readyDocuments: number;
    totalDocuments: number;
    decidedPinnedDecisions: number;
    totalPinnedDecisions: number;
    mapPins: number;
    conflicts: number;
  };
};

export type TripNextAction = {
  id: string;
  tone: "info" | "success" | "warning";
  title: string;
  description: string;
  href?: string;
};

export type GroupedMapPins = {
  label: string;
  dayId?: string;
  pins: MapPin[];
};
