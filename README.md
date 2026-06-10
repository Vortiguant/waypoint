# Waypoint

Waypoint is an editorial travel planning app for comparing destinations, building day-by-day itineraries, detecting schedule conflicts, and keeping trip budgets visible while plans change.

## Features

- Destination explorer with client-side search, filtering, and sorting
- Day-by-day itinerary builder with add, edit, delete, reorder, and move controls
- Schedule conflict detection for overlapping timed activities
- Budget dashboard with trip totals, category weights, and per-traveler cost
- Light and dark themes with persisted user preference
- Responsive product UI for desktop, tablet, and mobile

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

- `/` — product overview and trip preview
- `/destinations` — destination search and filtering
- `/itinerary` — itinerary builder and activity editor
- `/budget` — budget summary and category breakdown

## Project notes

The app uses local mocked travel data and browser storage for the sample trip state. The visual system is defined with OKLCH semantic tokens in `src/app/globals.css` and supports both light and dark themes.
