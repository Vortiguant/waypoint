# Waypoint Editorial Design System

## Direction

Waypoint now follows a warm editorial travel direction adapted from the Stitch reference in `/Users/adityanair/Downloads/stitch_waypoint_editorial_travel_planner/`. The UI should feel like a travel magazine that still behaves like a practical planner: calm, image-led, spacious, and clear under repeated use.

## Typography

- Display and section headings use Fraunces via `--font-display`.
- Body copy, labels, controls, and metadata use Manrope via `--font-body`.
- Large headings should be tight and confident, usually `tracking-[-0.02em]` or similar.
- Compact surfaces should not use hero-scale type. Use smaller Fraunces headings for cards, sidebars, and panels.
- Editorial labels use `.editorial-label`: uppercase, Manrope, 12px, bold, with positive letter spacing.

### Product type ladder

Product routes (`/workspace`, `/itinerary`, `/budget`) keep a small, operational hierarchy so the planning task reads more clearly than the chrome around it:

| Level | Use | Classes |
|-------|-----|---------|
| Page kicker | Route identity only | `.editorial-label text-accent` |
| Page title | One H1 per route | `font-serif text-4xl md:text-5xl` |
| Section title | Checklists, panels, settings, day planner | `text-lg font-bold text-ink` |
| Row label / meta | Form labels, counts, statuses | `text-sm font-semibold text-muted` |
| Status | Conflicts, readiness, success | semantic tokens, sentence case |

Reserve Fraunces (serif) on product routes for the page title and the day-column headings only; everything else uses Manrope so dense surfaces stay calm.

## Color

Tokens live in `src/app/globals.css` and are exposed through Tailwind theme aliases.

- `canvas`: warm paper background.
- `surface`: quiet base surface.
- `panel`: subtle grouped background.
- `panel-raised`: white or dark raised cards.
- `ink`: primary text.
- `muted` and `soft`: secondary text and placeholders.
- `line`: low-contrast borders.
- `accent`: restrained sienna, reserved for primary actions, important labels, progress bars, and state.
- `positive`, `warning`, and `danger`: functional states tuned to remain legible in the warm palette.

Avoid monochrome screens. Use generated travel imagery and small sienna accents to create warmth without flooding the interface.

## Layout

- Max content width is generally `max-w-7xl`.
- Desktop layouts use editorial two-column compositions where useful: narrative content plus sticky inquiry, planner plus logistics, budget dashboard plus insights.
- Mobile layouts collapse to one column with clear section spacing and stable touch targets.
- Major sections should breathe with 40-96px vertical rhythm depending on density.
- Cards and repeated items use 16px radius; inputs and buttons use 8px radius.

## Imagery

Use local production images under `public/images/editorial/`. Images should be shown through `next/image` with static dimensions, `fill` plus stable aspect ratios, or equivalent explicit sizing. Every image needs useful alt text.

## Brand Mark

Waypoint uses a generated compass-map mark for browser icons and the website header. When raster assets are present, the canonical transparent source is `public/images/brand/waypoint-logo.png`; derived browser assets live at `public/favicon.ico`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `public/icon.png`, `public/icon-192.png`, and `public/icon-512.png`. The in-app header uses `BrandLogo` (`src/components/layout/brand-logo.tsx`), an inline SVG compass mark paired with the Fraunces wordmark.

The mark should remain paired with the Fraunces text wordmark in primary navigation. Do not recolor it casually; it carries the sienna, ink, and ivory palette for the brand.

Current editorial assets:

- `kyoto-hero.png`
- `destination-marrakesh.png`
- `destination-amalfi.png`
- `destination-kyoto.png`
- `destination-nordic-cabin.png`
- `destination-yunnan-tea.png`
- `destination-provence.png`
- `stay-aman-kyoto.png`
- `stay-ritz-kyoto.png`
- `stay-sowaka.png`

## Components

- Buttons are formal rounded rectangles, not full pills.
- Primary buttons use sienna fill with high-contrast text.
- Secondary buttons use a solid surface, 1px border, and clear hover state.
- Cards use 1px borders and subtle tonal layering. Heavy shadows are avoided.
- Avoid default decorative glass effects. A single hero overlay is acceptable when it improves image text contrast.
- Avoid side-accent borders wider than 1px. Use full borders, tint, icons, or text state instead.
- Icons should come from `lucide-react` and support the action or state directly.

## Interaction

- All interactive elements need visible focus states.
- Hover motion should be subtle: opacity, border color, or a tiny lift.
- Respect `prefers-reduced-motion`.
- Preserve keyboard paths for destination filtering, itinerary editing, activity movement, and budget traveler controls.

## Motion

- Motion is calm and task-supportive, not decorative. Use it to confirm state, guide attention, and soften route or panel changes.
- Global motion tokens live in `src/app/globals.css`: `--motion-fast`, `--motion-state`, `--motion-enter`, `--ease-out-quart`, and `--ease-out-expo`.
- Use `.motion-page` for route-level entry, `.motion-hero-media` and `.motion-hero-copy` for the editorial hero moment, `.motion-grid` for short staggered item groups, `.motion-panel` for panels that enter after a state change, `.motion-status` for notices, and `.motion-budget-bar` for budget meter fills.
- Animate `transform` and `opacity` only for entrances and hover feedback. Do not animate layout properties.
- Keep feedback under 250ms and entrances under 700ms. Avoid bounce and elastic easing.
- Reduced motion must remain complete: content stays visible, hover/press transforms are disabled, and transitions collapse to near-instant changes.

## Route Patterns

- `/`: editorial landing with hero narrative, image-led destination grid, dispatch signup, and footer.
- `/workspace`: local-first command center with readiness scoring, next actions, packing, documents, pinned decisions, and spatial anchors.
- `/destinations`: searchable editorial browser retaining filter and sort behavior.
- `/destinations/[id]`: destination feature story with hero image, narrative, top decisions, inquiry panel, and stays.
- `/itinerary`: timeline planner preserving add, edit, delete, reorder, move, guarded reset, conflict detection, and hydration notices.
- `/budget`: trip insights dashboard preserving budget math, category totals, and local trip state. Traveler count is read-only here and edited from trip settings.
- Product routes share one vertical padding scale (`py-12 lg:py-16`); destination story pages may use a taller `py-12 lg:py-20`.

## Local Workspace Model

Trip prep data lives in the same local trip object as itinerary and budget state. The current storage key is `waypoint.trip.v3`, migrated from `waypoint.trip.v2` and `waypoint.trip.v1`.

- Packing, document, decision, and spatial-anchor controls should use inline editing rather than modal-heavy workflows.
- Readiness and next actions must stay deterministic and explainable.
- Spatial anchors are a static planning board for practical geography.
