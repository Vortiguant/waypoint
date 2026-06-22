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
    <Card className="p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">
            Budget Distribution
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            Current allocation across lodging, transport, dining, activities, and discretionary spend.
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm font-semibold text-muted">Total</p>
          <p className="mt-1 text-3xl font-extrabold leading-none tracking-[-0.02em] text-accent tabular-nums">
            {formatCurrency(summary.totalCost, currency)}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-muted">Per traveler</p>
          <p className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-ink tabular-nums">
            {formatCurrency(summary.perTravelerCost, currency)}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-muted">Split</p>
          <p className="mt-3 text-lg font-semibold leading-7 text-ink">
            Across {travelers} {travelers === 1 ? "traveler" : "travelers"} with every itinerary cost included.
          </p>
        </div>
      </div>
    </Card>
  );
}
