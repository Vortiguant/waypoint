"use client";

import { useState } from "react";
import type { Activity, ActivityCategory } from "@/types/travel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/status-message";
import { activitySchema } from "@/lib/validation/schemas";

const categories: ActivityCategory[] = [
  "transport",
  "lodging",
  "food",
  "activity",
  "shopping",
  "other",
];

type FormState = {
  title: string;
  location: string;
  notes: string;
  startTime: string;
  endTime: string;
  cost: string;
  category: ActivityCategory;
};

const emptyState: FormState = {
  title: "",
  location: "",
  notes: "",
  startTime: "",
  endTime: "",
  cost: "0",
  category: "activity",
};

function stateFromActivity(activity?: Activity): FormState {
  if (!activity) return emptyState;

  return {
    title: activity.title,
    location: activity.location,
    notes: activity.notes,
    startTime: activity.startTime ?? "",
    endTime: activity.endTime ?? "",
    cost: String(activity.cost),
    category: activity.category,
  };
}

export function ActivityForm({
  activity,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  activity?: Activity;
  submitLabel: string;
  onSubmit: (activity: Activity) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => stateFromActivity(activity));
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = activitySchema.safeParse({
          id: activity?.id ?? crypto.randomUUID(),
          ...form,
          cost: Number(form.cost),
        });

        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message ?? "Check the activity details.");
          return;
        }

        setError(null);
        onSubmit({
          ...parsed.data,
          notes: parsed.data.notes ?? "",
          startTime: parsed.data.startTime || undefined,
          endTime: parsed.data.endTime || undefined,
        });

        if (!activity) {
          setForm(emptyState);
        }
      }}
    >
      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 text-xs font-bold text-muted">
          Title
          <Input value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
        </label>
        <label className="space-y-1.5 text-xs font-bold text-muted">
          Location
          <Input value={form.location} onChange={(event) => updateField("location", event.target.value)} required />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <label className="space-y-1.5 text-xs font-bold text-muted">
          Start
          <Input type="time" value={form.startTime} onChange={(event) => updateField("startTime", event.target.value)} />
        </label>
        <label className="space-y-1.5 text-xs font-bold text-muted">
          End
          <Input type="time" value={form.endTime} onChange={(event) => updateField("endTime", event.target.value)} />
        </label>
        <label className="space-y-1.5 text-xs font-bold text-muted">
          Cost
          <Input type="number" min="0" value={form.cost} onChange={(event) => updateField("cost", event.target.value)} />
        </label>
        <label className="space-y-1.5 text-xs font-bold text-muted">
          Category
          <Select value={form.category} onChange={(event) => updateField("category", event.target.value as ActivityCategory)}>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </label>
      </div>
      <label className="block space-y-1.5 text-xs font-bold text-muted">
        Notes
        <Input value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">{submitLabel}</Button>
        {onCancel ? <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button> : null}
      </div>
    </form>
  );
}
