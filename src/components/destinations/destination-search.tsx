"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { destinations, destinationRegions } from "@/lib/data/mock-destinations";
import { DestinationGrid } from "@/components/destinations/destination-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/status-message";

const styles = ["all", "culture", "adventure", "relaxation", "food", "nature"];
const budgets = ["all", "under-175", "175-220", "over-220"];

function matchesBudget(cost: number, budget: string) {
  if (budget === "under-175") return cost < 175;
  if (budget === "175-220") return cost >= 175 && cost <= 220;
  if (budget === "over-220") return cost > 220;
  return true;
}

function formatBudgetLabel(budget: string) {
  if (budget === "under-175") return "Under $175";
  if (budget === "175-220") return "$175-$220";
  if (budget === "over-220") return "Over $220";
  return "Any budget";
}

export function DestinationSearch() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [style, setStyle] = useState("all");
  const [budget, setBudget] = useState("all");
  const [sort, setSort] = useState("recommended");
  const hasActiveFilters =
    query.trim() !== "" ||
    region !== "all" ||
    style !== "all" ||
    budget !== "all" ||
    sort !== "recommended";

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return destinations
      .filter((destination) => {
        const text = [destination.name, destination.country, destination.region, destination.description, ...destination.tags]
          .join(" ")
          .toLowerCase();

        return (
          (!normalizedQuery || text.includes(normalizedQuery)) &&
          (region === "all" || destination.region === region) &&
          (style === "all" || destination.style === style) &&
          matchesBudget(destination.estimatedDailyCost, budget)
        );
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.estimatedDailyCost - b.estimatedDailyCost;
        if (sort === "price-high") return b.estimatedDailyCost - a.estimatedDailyCost;
        if (sort === "name") return a.name.localeCompare(b.name);
        return b.rating - a.rating;
      });
  }, [budget, query, region, sort, style]);

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-2xl border border-line bg-panel-raised p-4 md:p-5" aria-label="Destination filters">
        <div className="grid gap-3 lg:grid-cols-[minmax(18rem,1.4fr)_repeat(4,minmax(9rem,1fr))]">
          <label className="relative block space-y-1.5">
            <span className="editorial-label text-muted">Search</span>
            <Search className="pointer-events-none absolute left-3.5 top-[2.55rem] size-4 text-muted" aria-hidden="true" />
            <Input className="pl-10" placeholder="Place, mood, or tag" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="editorial-label text-muted">Region</span>
            <Select value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="all">All regions</option>
              {destinationRegions.map((item) => <option key={item} value={item}>{item}</option>)}
            </Select>
          </label>
          <label className="space-y-1.5">
            <span className="editorial-label text-muted">Style</span>
            <Select value={style} onChange={(event) => setStyle(event.target.value)}>
              {styles.map((item) => <option key={item} value={item}>{item === "all" ? "All styles" : item}</option>)}
            </Select>
          </label>
          <label className="space-y-1.5">
            <span className="editorial-label text-muted">Budget</span>
            <Select value={budget} onChange={(event) => setBudget(event.target.value)}>
              {budgets.map((item) => <option key={item} value={item}>{formatBudgetLabel(item)}</option>)}
            </Select>
          </label>
          <label className="space-y-1.5">
            <span className="editorial-label text-muted">Sort</span>
            <Select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="recommended">Top rated</option>
              <option value="price-low">Lowest cost</option>
              <option value="price-high">Highest cost</option>
              <option value="name">A to Z</option>
            </Select>
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            className="gap-2"
            disabled={!hasActiveFilters}
            onClick={() => {
              setQuery("");
              setRegion("all");
              setStyle("all");
              setBudget("all");
              setSort("recommended");
            }}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Clear filters
          </Button>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StatusMessage tone="info" className="sm:max-w-xl">
          {filtered.length} {filtered.length === 1 ? "destination" : "destinations"} match the current filters.
        </StatusMessage>
        <p className="text-sm font-semibold leading-6 text-muted">
          Mocked local data - instant client-side filtering
        </p>
      </div>

      <DestinationGrid destinations={filtered} />
    </div>
  );
}
