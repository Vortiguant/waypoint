"use client";

import { useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  readSavedIds,
  SAVED_DESTINATIONS_KEY,
  SAVED_STAYS_KEY,
  toggleSavedId,
} from "@/lib/storage/saved-items";
import { cn } from "@/lib/utils";

function subscribeToSavedItems(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("waypoint:saved-items", onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("waypoint:saved-items", onChange);
  };
}

export function SaveButton({
  id,
  label,
  kind,
  compact = false,
}: {
  id: string;
  label: string;
  kind: "destination" | "stay";
  compact?: boolean;
}) {
  const key = kind === "destination" ? SAVED_DESTINATIONS_KEY : SAVED_STAYS_KEY;
  const saved = useSyncExternalStore(
    subscribeToSavedItems,
    () => readSavedIds(key).has(id),
    () => false,
  );

  function toggle() {
    toggleSavedId(key, id);
    window.dispatchEvent(new Event("waypoint:saved-items"));
  }

  if (compact) {
    return (
      <button
        type="button"
        className={cn(
          "inline-grid size-11 shrink-0 place-items-center rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          saved ? "bg-accent text-accent-ink" : "text-accent hover:bg-panel",
        )}
        aria-label={`${saved ? "Unsave" : "Save"} ${label}`}
        aria-pressed={saved}
        onClick={toggle}
      >
        <Heart className={cn("size-4", saved && "fill-current")} aria-hidden="true" />
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant={saved ? "primary" : "secondary"}
      className="gap-2"
      aria-pressed={saved}
      onClick={toggle}
    >
      <Heart className={cn("size-4", saved && "fill-current")} aria-hidden="true" />
      {saved ? "Saved" : "Save"}
    </Button>
  );
}
