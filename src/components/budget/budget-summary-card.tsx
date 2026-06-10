import type { BudgetSummary } from "@/types/travel";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function BudgetSummaryCard({
  summary,
  currency,
  travelers,
}: {
  summary: BudgetSummary;
  currency: string;
  travelers: number;
}) {
  return (
    <Card className="grid gap-5 md:grid-cols-2">
      <div>
        <p className="text-sm font-semibold text-accent">Total trip cost</p>
        <p className="mt-4 font-serif text-6xl font-semibold leading-none tracking-[-0.025em] text-ink">
          {formatCurrency(summary.totalCost, currency)}
        </p>
      </div>
      <div className="bg-ink p-5 text-surface dark:bg-panel dark:text-ink">
        <p className="text-sm font-semibold opacity-75">Per traveler</p>
        <p className="mt-4 font-serif text-5xl font-semibold leading-none tracking-[-0.02em]">
          {formatCurrency(summary.perTravelerCost, currency)}
        </p>
        <p className="mt-3 text-sm opacity-75">Split across {travelers} {travelers === 1 ? "traveler" : "travelers"}.</p>
      </div>
    </Card>
  );
}
