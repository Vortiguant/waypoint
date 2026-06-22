# Waypoint

Waypoint is a local-first editorial travel planner for comparing destinations, building day-by-day itineraries, detecting schedule conflicts, and understanding trip budget and logistics tradeoffs without a backend.

The current UI follows a warm editorial travel system: generated destination photography, Fraunces display type, Manrope interface text, sienna accents, responsive planner surfaces, and a generated Waypoint compass-map brand mark.

## Features

- Editorial landing page with generated travel imagery and local newsletter validation
- Destination explorer with client-side search, filtering, sorting, and clear filters
- Destination detail pages with narrative content, local inquiry validation, and saved stays/destinations
- Trip workspace command center with readiness scoring, next actions, pinned decisions, packing, documents, and spatial anchors
- Day-by-day itinerary builder with add, edit, delete, undo delete, reorder, and move controls
- Editable trip settings for title, destination, dates, travelers, currency, budget target, pace, and notes
- Schedule conflict detection for overlapping timed activities
- Local calendar export to `.ics` for timed itinerary activities
- Clipboard trip sharing with a readable local summary
- Insights dashboard with deterministic budget health, pace fit, logistics risk, conflict load, value score, and recommendations
- Light and dark themes with persisted user preference
- Responsive product UI for desktop, tablet, and mobile

## Local-first behavior

Waypoint V1 does not use accounts, auth, server persistence, network email, or calendar sync. Browser storage is used for:

- Trip state: `waypoint.trip.v3` (accepts legacy `mapPins` field during normalization; persisted trips use `spatialAnchors`)
- Legacy trip migration from `waypoint.trip.v2` and `waypoint.trip.v1`
- Saved destinations and stays
- Theme preference

Invalid or older trip data falls back to the bundled sample trip while preserving usable fields during migration when possible.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Vitest
- Zod

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Scripts

```bash
npm run lint      # Run ESLint
npm run test      # Run Vitest once
npm run test:watch # Run Vitest in watch mode
npm run build     # Create a production build
npm run start     # Start the production server
```

## Routes

- `/` — editorial destination landing and dispatch signup
- `/workspace` — trip readiness, next actions, packing, documents, pinned decisions, and spatial anchors
- `/destinations` — destination search, filtering, sorting, and saved-state entry points
- `/destinations/[id]` — destination story, inquiry form, and recommended stays
- `/itinerary` — local trip settings, timeline planner, activity editor, calendar export, and share
- `/budget` — explainable insights dashboard and budget category breakdown

## Important paths

- `src/lib/insights/calculate.ts` — pure trip insights engine
- `src/lib/workspace/readiness.ts` — pure workspace readiness and next-action helpers
- `src/lib/calendar/export.ts` — pure `.ics` export helper
- `src/lib/sharing/trip-summary.ts` — shareable trip summary helper
- `src/lib/storage/local-storage.ts` — trip storage and v1 to v2 migration
- `src/lib/storage/saved-items.ts` — saved destination/stay storage
- `src/lib/data/mock-destinations.ts` — destination editorial data
- `src/lib/data/mock-trip.ts` — bundled sample trip
- `public/images/editorial/` — generated destination and stay imagery
- `public/images/brand/` — generated Waypoint logo assets
- `DESIGN.md` — current visual system and route patterns

## Testing

Run the standard checks before shipping:

```bash
npm run lint
npm run test
npm run build
```

The unit tests cover:

- Budget totals and per-traveler math
- Schedule conflict detection
- Trip insights scoring and recommendations
- v1/v2 to v3 local storage migration
- Workspace readiness, next actions, and spatial anchor grouping
- Calendar export behavior
- Share summary generation

## Project notes

This app intentionally ships as a local-first product surface. Placeholder network actions have been replaced by local behavior and explicit confirmation states.

The visual system is defined with OKLCH semantic tokens in `src/app/globals.css`, documented in `DESIGN.md`, and supports both light and dark themes. Generated production images live in `public/images/` and are referenced through `next/image` where used in the UI.
