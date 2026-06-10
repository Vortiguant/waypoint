import type { BudgetSummary } from "@/types/travel";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function BudgetCategoryList({ summary, currency }: { summary: BudgetSummary; currency: string }) {
  const largest = Math.max(...summary.byCategory.map((item) => item.total), 1);

  return (
    <Card>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-accent">Category weight</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.02em] text-ink">Where the money goes</h2>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {summary.byCategory.map((item) => {
          const width = `${Math.max(4, (item.total / largest) * 100)}%`;

          return (
            <div key={item.category}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="font-bold capitalize text-ink">{item.category}</span>
                <span className="text-muted">{formatCurrency(item.total, currency)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-panel">
                <div className="h-full rounded-full bg-accent" style={{ width }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
