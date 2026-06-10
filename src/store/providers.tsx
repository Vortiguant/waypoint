"use client";

import { ThemeProvider } from "@/store/theme-store";
import { TripProvider } from "@/store/trip-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TripProvider>{children}</TripProvider>
    </ThemeProvider>
  );
}
