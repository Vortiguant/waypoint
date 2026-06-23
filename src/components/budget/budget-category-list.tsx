import { Landmark, Map, ShoppingBag, Soup, Ticket, Train } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ActivityCategory, BudgetSummary } from "@/types/travel";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const categoryMeta: Record<ActivityCategory, { label: string; Icon: LucideIcon }> = {
  transport: { label: "Transport", Icon: Train },
  lodging: { label: "Lodging", Icon: Landmark },
  food: { label: "Dining", Icon: Soup },
  activity: { label: "Activities", Icon: Ticket },
  shopping: { label: "Shopping", Icon: ShoppingBag },
  other: { label: "Other", Icon: Map },
};

export function BudgetCategoryList({
  summary,
  currency,
  updatedAt,
}: {
  summary: BudgetSummary;
  currency: string;
  updatedAt: string;
}) {
  const largest = Math.max(...summary.byCategory.map((item) => item.total), 1);
  const updatedLabel = new Date(updatedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-accent">Allocation</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">
            Where the money goes
          </h2>
        </div>
        <p className="text-sm font-semibold text-muted">Updated {updatedLabel}</p>
      </div>

      <div className="mt-7 space-y-7">
        {summary.byCategory.map((item) => {
          const scale = Math.max(0.03, item.total / largest);
          const { label, Icon } = categoryMeta[item.category];

          return (
            <div key={item.category} className="space-y-2">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Icon className="size-5 text-accent" aria-hidden="true" />
                  <span className="text-sm font-bold text-ink">{label}</span>
                </div>
                <span className="text-sm font-semibold text-muted">
                  {formatCurrency(item.total, currency)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-lg bg-panel">
                <div className="motion-budget-bar h-full w-full origin-left rounded-lg bg-accent" style={{ transform: `scaleX(${scale})` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
