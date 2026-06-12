import type { Destination } from "@/types/travel";
import { DestinationCard } from "@/components/destinations/destination-card";
import { EmptyState } from "@/components/ui/empty-state";

export function DestinationGrid({ destinations }: { destinations: Destination[] }) {
  if (destinations.length === 0) {
    return (
      <EmptyState
        title="No matching routes"
        description="Try widening the budget, clearing the region, or searching for a different mood."
      />
    );
  }

  return (
    <div className="motion-grid grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {destinations.map((destination, index) => (
        <div
          key={destination.id}
          className={index === 3 ? "xl:col-span-2" : undefined}
        >
          <DestinationCard
            destination={destination}
            priority={index < 4}
            featured={index === 3}
            badge={index === 0 ? "Strongest current match" : undefined}
          />
        </div>
      ))}
    </div>
  );
}
