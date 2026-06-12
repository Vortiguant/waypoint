"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusMessage } from "@/components/ui/status-message";

export function TripPreview() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  return (
    <section className="motion-panel border-y border-line bg-canvas px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-4xl font-semibold leading-tight tracking-[-0.02em] text-ink md:text-5xl">
          The Weekly Dispatch
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted md:text-base">
          A curated selection of travel notes, architectural finds, and slow-living tips delivered to your inbox every Sunday morning.
        </p>
        <form
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            setStatus(
              isValid
                ? {
                    tone: "success",
                    message: "Subscribed locally. No email was sent.",
                  }
                : {
                    tone: "error",
                    message: "Enter a valid email address.",
                  },
            );
          }}
        >
          <label className="sr-only" htmlFor="dispatch-email">Email address</label>
          <Input
            id="dispatch-email"
            type="email"
            placeholder="Email address"
            className="bg-surface text-left"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" className="shrink-0">Subscribe</Button>
        </form>
        {status ? (
          <div className="mx-auto mt-4 max-w-xl text-left">
            <StatusMessage tone={status.tone}>{status.message}</StatusMessage>
          </div>
        ) : null}
      </div>
    </section>
  );
}
