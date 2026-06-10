import { FeatureGrid } from "@/components/marketing/feature-grid";
import { Hero } from "@/components/marketing/hero";
import { TripPreview } from "@/components/marketing/trip-preview";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <TripPreview />
    </>
  );
}
