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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {destinations.map((destination, index) => (
        <DestinationCard key={destination.id} destination={destination} priority={index === 0} />
      ))}
    </div>
  );
}
