import { calculateBudget } from "@/lib/budget/calculate";
import { findScheduleConflicts, timeToMinutes } from "@/lib/itinerary/conflicts";
import { formatCurrency } from "@/lib/utils";
import type {
  Destination,
  InsightRecommendation,
  InsightStatus,
  PacePreference,
  Trip,
  TripInsights,
} from "@/types/travel";

const paceTargets: Record<PacePreference, [number, number]> = {
  relaxed: [1, 2],
  balanced: [2, 3],
  packed: [3, 5],
};

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(10, round(value)));
}

function statusFromScore(score: number): InsightStatus {
  if (score >= 8) return "good";
  if (score >= 5.5) return "watch";
  return "risk";
}

function formatRange([min, max]: [number, number]) {
  return `${min}-${max}`;
}

function getTightGaps(trip: Trip) {
  return trip.days.reduce((count, day) => {
    const timed = day.activities
      .map((activity) => {
        if (!activity.startTime || !activity.endTime) return null;
        const start = timeToMinutes(activity.startTime);
        const end = timeToMinutes(activity.endTime);
        if (start === null || end === null || end <= start) return null;
        return { start, end };
      })
      .filter((activity): activity is { start: number; end: number } => activity !== null)
      .sort((a, b) => a.start - b.start);

    return (
      count +
      timed.reduce((dayCount, activity, index) => {
        const next = timed[index + 1];
        if (!next) return dayCount;
        const gap = next.start - activity.end;
        return gap >= 0 && gap < 45 ? dayCount + 1 : dayCount;
      }, 0)
    );
  }, 0);
}

function getEarlyStarts(trip: Trip) {
  return trip.days.reduce(
    (count, day) =>
      count +
      day.activities.filter((activity) => {
        if (!activity.startTime) return false;
        const start = timeToMinutes(activity.startTime);
        return start !== null && start < 8 * 60;
      }).length,
    0,
  );
}

function getUntimedActivities(trip: Trip) {
  return trip.days.reduce(
    (count, day) =>
      count +
      day.activities.filter((activity) => !activity.startTime || !activity.endTime).length,
    0,
  );
}

function recommendation(
  id: string,
  tone: InsightRecommendation["tone"],
  title: string,
  description: string,
): InsightRecommendation {
  return { id, tone, title, description };
}

export function calculateTripInsights(trip: Trip, destination: Destination): TripInsights {
  const summary = calculateBudget(trip);
  const conflicts = findScheduleConflicts(trip.days);
  const totalActivities = trip.days.reduce((total, day) => total + day.activities.length, 0);
  const dayCount = Math.max(1, trip.days.length);
  const dailyAverage = summary.totalCost / dayCount;
  const target = trip.budgetTarget;
  const recommendations: InsightRecommendation[] = [];

  const budgetScore =
    typeof target === "number" && target > 0
      ? target >= summary.totalCost
        ? summary.totalCost < target * 0.5
          ? 8
          : 10
        : 10 - ((summary.totalCost / target - 1) * 20)
      : 6;
  const normalizedBudgetScore = clampScore(budgetScore);
  const variance =
    typeof target === "number" && target > 0 ? round(summary.totalCost - target, 2) : undefined;

  if (!target || target <= 0) {
    recommendations.push(
      recommendation(
        "set-budget-target",
        "warning",
        "Set a budget target",
        "Waypoint can judge spend only loosely until this trip has a target.",
      ),
    );
  } else if (summary.totalCost > target) {
    recommendations.push(
      recommendation(
        "reduce-budget",
        "warning",
        "Trim or rebalance the plan",
        `${formatCurrency(summary.totalCost - target, trip.currency)} is currently above target.`,
      ),
    );
  }

  const pacePreference = trip.pacePreference ?? "balanced";
  const targetRange = paceTargets[pacePreference];
  const activitiesPerDay = totalActivities / dayCount;
  const paceDelta =
    activitiesPerDay < targetRange[0]
      ? targetRange[0] - activitiesPerDay
      : activitiesPerDay > targetRange[1]
        ? activitiesPerDay - targetRange[1]
        : 0;
  const paceScoreValue = clampScore(10 - paceDelta * 2.5);

  if (paceDelta > 0) {
    recommendations.push(
      recommendation(
        "adjust-pace",
        "info",
        "Adjust the itinerary pace",
        `${round(activitiesPerDay)} activities per day sits outside the ${pacePreference} target of ${formatRange(targetRange)}.`,
      ),
    );
  }

  const earlyStarts = getEarlyStarts(trip);
  const tightGaps = getTightGaps(trip);
  const untimedActivities = getUntimedActivities(trip);
  const affectedActivities = new Set(conflicts.flatMap((conflict) => conflict.activityIds)).size;
  const conflictScore = clampScore(10 - conflicts.length * 3 - affectedActivities);
  const logisticsScore = clampScore(
    10 - conflicts.length * 3 - tightGaps * 2 - earlyStarts - untimedActivities * 0.75,
  );

  if (conflicts.length > 0) {
    recommendations.push(
      recommendation(
        "resolve-conflicts",
        "warning",
        "Resolve schedule overlaps",
        `${conflicts.length} overlap ${conflicts.length === 1 ? "needs" : "need"} attention before the plan is reliable.`,
      ),
    );
  }

  if (tightGaps > 0) {
    recommendations.push(
      recommendation(
        "loosen-tight-gaps",
        "info",
        "Add transfer breathing room",
        `${tightGaps} timed gap ${tightGaps === 1 ? "is" : "are"} under 45 minutes.`,
      ),
    );
  }

  if (untimedActivities > 0) {
    recommendations.push(
      recommendation(
        "time-flexible-items",
        "info",
        "Time the flexible items",
        `${untimedActivities} activity ${untimedActivities === 1 ? "is" : "are"} missing a start or end time.`,
      ),
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      recommendation(
        "plan-on-track",
        "success",
        "Plan is holding together",
        "Budget, pace, and schedule risk are all within the expected range.",
      ),
    );
  }

  const destinationRatingScore = clampScore((destination.rating / 5) * 10);
  const valueScore = clampScore(
    normalizedBudgetScore * 0.3 +
      paceScoreValue * 0.2 +
      logisticsScore * 0.2 +
      conflictScore * 0.2 +
      destinationRatingScore * 0.1,
  );

  return {
    budgetHealth: {
      label: "Budget health",
      score: normalizedBudgetScore,
      status: statusFromScore(normalizedBudgetScore),
      detail:
        target && target > 0
          ? `${formatCurrency(summary.totalCost, trip.currency)} planned against ${formatCurrency(target, trip.currency)} target.`
          : "No budget target set, so the score uses current spend only.",
      inputs: [
        `Total planned: ${formatCurrency(summary.totalCost, trip.currency)}`,
        `Daily average: ${formatCurrency(dailyAverage, trip.currency)}`,
        target && target > 0 ? `Target variance: ${formatCurrency(summary.totalCost - target, trip.currency)}` : "Target missing",
      ],
      totalCost: summary.totalCost,
      target,
      variance,
      dailyAverage,
    },
    paceScore: {
      label: "Pace fit",
      score: paceScoreValue,
      status: statusFromScore(paceScoreValue),
      detail: `${round(activitiesPerDay)} activities per day for a ${pacePreference} trip.`,
      inputs: [
        `${totalActivities} activities`,
        `${dayCount} days`,
        `${pacePreference} target: ${formatRange(targetRange)} activities per day`,
      ],
      activitiesPerDay: round(activitiesPerDay),
      targetRange,
    },
    logisticsRisk: {
      label: "Logistics risk",
      score: logisticsScore,
      status: statusFromScore(logisticsScore),
      detail: `${earlyStarts} early starts, ${tightGaps} tight gaps, ${untimedActivities} untimed items.`,
      inputs: [
        `${earlyStarts} starts before 08:00`,
        `${tightGaps} transfer gaps under 45 minutes`,
        `${untimedActivities} activities missing full times`,
      ],
      earlyStarts,
      tightGaps,
      untimedActivities,
    },
    conflictLoad: {
      label: "Conflict load",
      score: conflictScore,
      status: statusFromScore(conflictScore),
      detail: `${conflicts.length} overlap ${conflicts.length === 1 ? "found" : "found"} across ${affectedActivities} activities.`,
      inputs: [
        `${conflicts.length} conflicts`,
        `${affectedActivities} affected activities`,
        "Score subtracts 3 points per overlap plus 1 per affected activity.",
      ],
      conflictCount: conflicts.length,
      affectedActivities,
    },
    valueScore: {
      label: "Value score",
      score: valueScore,
      status: statusFromScore(valueScore),
      detail:
        "Weighted from budget fit 30%, pace 20%, logistics 20%, conflicts 20%, and destination rating 10%.",
      inputs: [
        `Budget ${normalizedBudgetScore}/10`,
        `Pace ${paceScoreValue}/10`,
        `Logistics ${logisticsScore}/10`,
        `Conflicts ${conflictScore}/10`,
        `Destination rating ${destination.rating.toFixed(1)}/5`,
      ],
      destinationRating: destination.rating,
    },
    recommendations,
  };
}
