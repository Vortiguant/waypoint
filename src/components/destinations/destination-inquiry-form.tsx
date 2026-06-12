"use client";

import { useState } from "react";
import { CalendarDays, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/status-message";

export function DestinationInquiryForm({ destinationName }: { destinationName: string }) {
  const [dateRange, setDateRange] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [requests, setRequests] = useState("");
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  return (
    <form
      className="mt-6 space-y-5"
      onSubmit={(event) => {
        event.preventDefault();

        if (dateRange.trim().length < 4) {
          setStatus({ tone: "error", message: "Add a date range before saving the inquiry." });
          return;
        }

        setStatus({
          tone: "success",
          message: `${destinationName} inquiry saved locally for ${travelers} ${travelers === "1" ? "traveler" : "travelers"}. No message was sent.`,
        });
      }}
    >
      <label className="block space-y-1.5">
        <span className="editorial-label text-muted">Date range</span>
        <div className="relative">
          <Input
            placeholder="Oct 14-21, 2026"
            className="pr-10"
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
          />
          <CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        </div>
      </label>
      <label className="block space-y-1.5">
        <span className="editorial-label text-muted">Guest count</span>
        <Select value={travelers} onChange={(event) => setTravelers(event.target.value)}>
          <option value="1">1 traveler</option>
          <option value="2">2 travelers</option>
          <option value="4">4 travelers</option>
        </Select>
      </label>
      <label className="block space-y-1.5">
        <span className="editorial-label text-muted">Specific requests</span>
        <textarea
          className="min-h-28 w-full rounded-lg border border-line bg-surface px-3.5 py-3 text-sm text-ink outline-none transition-[border-color,box-shadow,transform] duration-200 ease-[var(--ease-out)] placeholder:text-soft focus:-translate-y-px focus:border-accent focus:ring-2 focus:ring-accent/20 dark:bg-panel"
          placeholder="Dietary needs, accessibility, or interests..."
          value={requests}
          onChange={(event) => setRequests(event.target.value)}
        />
      </label>
      <Button type="submit" className="w-full gap-2">
        Save inquiry <Send className="size-4" aria-hidden="true" />
      </Button>
      {status ? <StatusMessage tone={status.tone}>{status.message}</StatusMessage> : null}
    </form>
  );
}
