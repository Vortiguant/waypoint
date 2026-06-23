import type { ScheduleConflict } from "@/types/travel";
import { StatusMessage } from "@/components/ui/status-message";

export function ConflictAlert({ conflicts }: { conflicts: ScheduleConflict[] }) {
  if (conflicts.length === 0) {
    return null;
  }

  return (
    <StatusMessage tone="error">
      <span className="block font-bold">Schedule conflict detected</span>
      <span>{conflicts.map((conflict) => conflict.message).join(" ")}</span>
    </StatusMessage>
  );
}
