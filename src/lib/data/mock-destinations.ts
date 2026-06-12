import type { Destination } from "@/types/travel";

const kyotoDecisions = [
  {
    label: "Morning ritual",
    title: "Daitoku-ji tea study",
    description:
      "Private tea ceremony in the temple complex, focused on the meditative quality of Urasenke traditions.",
  },
  {
    label: "Artisan walk",
    title: "Nishijin weaving district",
    description:
      "A guided stroll through historic textile houses to meet seventh-generation craft studios.",
  },
  {
    label: "Culinary depth",
    title: "Kamo River counter dinner",
    description:
      "Chef's counter kaiseki with seasonal courses and a quiet view toward the river.",
  },
];

const kyotoStays = [
  {
    name: "Aman Kyoto",
    tags: ["Ryokan", "Higashiyama"],
    description:
      "A hidden garden sanctuary at the foot of Hidari Daimonji with quiet tatami rooms.",
    price: "From $1,200 / night",
    imageSrc: "/images/editorial/stay-aman-kyoto.png",
    imageAlt: "Minimal Kyoto ryokan guest room with tatami bedding and a garden view.",
  },
  {
    name: "The Ritz-Carlton",
    tags: ["Modern", "Central"],
    description:
      "Overlooking the Kamo River, blending contemporary luxury with local craft details.",
    price: "From $950 / night",
    imageSrc: "/images/editorial/stay-ritz-kyoto.png",
    imageAlt: "Modern Kyoto hotel lounge with dark wood and broad garden-facing windows.",
  },
  {
    name: "Sowaka",
    tags: ["Heritage", "Gion"],
    description:
      "A restored sukiya-style residence offering an intimate experience of the city's old quarter.",
    price: "From $820 / night",
    imageSrc: "/images/editorial/stay-sowaka.png",
    imageAlt: "Lantern-lit Kyoto heritage street with traditional wooden machiya facades.",
  },
];

export const destinations: Destination[] = [
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    description:
      "Temple gardens, cedar rituals, and slow mornings between mountain shrines.",
    image: "linear-gradient(135deg, #f7c8a0 0%, #d9896a 45%, #59332e 100%)",
    imageSrc: "/images/editorial/destination-kyoto.png",
    imageAlt: "Autumn maple leaves framing a quiet Kyoto Zen garden and wooden temple porch.",
    heroImageSrc: "/images/editorial/kyoto-hero.png",
    heroImageAlt: "Japanese temple pavilion reflected in a still pond during golden hour.",
    editorialTitle: "Kyoto: The Timeless Narrative",
    detailSummary:
      "A curated journey through the former imperial capital, where the scent of cedar and the rhythm of traditional rituals define the passage of time.",
    detailDescription:
      "Kyoto is not merely a city; it is a repository of Japanese history. Here, the editorial calm of Zen gardens meets the intricate precision of kaiseki dining. Every street in Gion tells a story of centuries-old craftsmanship, from silk weaving to carefully maintained machiya townhouses. To visit Kyoto is to participate in a slow-motion study of intentionality.",
    decisions: kyotoDecisions,
    stays: kyotoStays,
    tags: ["temples", "tea houses", "spring blooms"],
    style: "culture",
    rating: 4.9,
    estimatedDailyCost: 210,
    bestMonths: ["Mar", "Apr", "Nov"],
  },
  {
    id: "amalfi",
    name: "Emerald Grotto",
    country: "Italy",
    region: "Europe",
    description:
      "Quiet coves, limestone cliffs, and a slower reading of the Amalfi coast.",
    image: "linear-gradient(135deg, #84d8ce 0%, #1e9db0 45%, #1f3f46 100%)",
    imageSrc: "/images/editorial/destination-amalfi.png",
    imageAlt: "Secluded Mediterranean cove with turquoise water and a wooden sailboat.",
    heroImageSrc: "/images/editorial/destination-amalfi.png",
    heroImageAlt: "Secluded Mediterranean cove with turquoise water and limestone cliffs.",
    editorialTitle: "Amalfi: The Quiet Blue",
    detailSummary:
      "A coastal study in bright water, limestone paths, and lunch reservations that should never be rushed.",
    detailDescription:
      "The best Amalfi plans leave room between transfers. This route favors smaller coves, early ferries, and cliffside meals with enough time to watch the light change over the water.",
    decisions: [
      {
        label: "Coastal window",
        title: "Early ferry to the cove",
        description: "Use the first boat of the morning to reach the water before tour traffic gathers.",
      },
      {
        label: "Lunch anchor",
        title: "Long table above the water",
        description: "Reserve one slow seafood lunch rather than stacking three sightseeing stops.",
      },
      {
        label: "Evening return",
        title: "Walk back through town",
        description: "End with the pedestrian lanes after day visitors clear out.",
      },
    ],
    stays: kyotoStays,
    tags: ["coast", "sailing", "slow living"],
    style: "relaxation",
    rating: 4.7,
    estimatedDailyCost: 220,
    bestMonths: ["May", "Jun", "Sep"],
  },
  {
    id: "marrakesh",
    name: "The Ocher Atrium",
    country: "Morocco",
    region: "Africa",
    description:
      "Courtyard riads, desert day trips, and earth-toned architectural craft.",
    image: "linear-gradient(135deg, #ffb199 0%, #c8553d 50%, #4a2c2a 100%)",
    imageSrc: "/images/editorial/destination-marrakesh.png",
    imageAlt: "Minimal ocher desert architecture in Morocco during golden hour.",
    heroImageSrc: "/images/editorial/destination-marrakesh.png",
    heroImageAlt: "Ocher sandstone architecture and sparse desert planting in Morocco.",
    editorialTitle: "Marrakesh: The Ocher Atrium",
    detailSummary:
      "A crafted route through riads, courtyards, and desert edges, balanced by quiet interiors.",
    detailDescription:
      "Marrakesh works best as a study in contrast: dense markets followed by still courtyard shade, ornate craft followed by open desert geometry.",
    decisions: [
      {
        label: "Design walk",
        title: "Medina craft circuit",
        description: "Focus on a short set of ateliers rather than a full market sweep.",
      },
      {
        label: "Quiet hour",
        title: "Riad courtyard reset",
        description: "Protect the middle of the day for shade, tea, and notes.",
      },
      {
        label: "Desert edge",
        title: "Late light outside the city",
        description: "Plan the desert excursion around golden hour, not transit convenience.",
      },
    ],
    stays: kyotoStays,
    tags: ["markets", "design", "desert"],
    style: "culture",
    rating: 4.6,
    estimatedDailyCost: 130,
    bestMonths: ["Mar", "Apr", "Oct"],
  },
  {
    id: "nordic-cabin",
    name: "The Glass Observatory",
    country: "Norway",
    region: "Europe",
    description:
      "A secluded retreat for stargazing and reflection amid snow-dark pines.",
    image: "linear-gradient(135deg, #9bc5d6 0%, #21485a 45%, #071922 100%)",
    imageSrc: "/images/editorial/destination-nordic-cabin.png",
    imageAlt: "Modern glass cabin glowing in a snowy Nordic pine forest at twilight.",
    heroImageSrc: "/images/editorial/destination-nordic-cabin.png",
    heroImageAlt: "Glass-walled Nordic cabin in a snowy pine forest at blue hour.",
    editorialTitle: "Norway: The Glass Observatory",
    detailSummary:
      "A winter route for travelers who want silence, stargazing, and the discipline of doing less.",
    detailDescription:
      "The northern cabin route replaces crowded winter checklists with one clear purpose: protect darkness, warmth, and time outdoors.",
    decisions: [
      {
        label: "Arrival window",
        title: "Reach the cabin before dusk",
        description: "Avoid night driving and let the first evening become part of the trip.",
      },
      {
        label: "Night watch",
        title: "Reserve two aurora windows",
        description: "Keep the schedule loose enough to follow clear-sky forecasts.",
      },
      {
        label: "Recovery day",
        title: "Sauna and forest loop",
        description: "Use one day for low-effort movement and warm interiors.",
      },
    ],
    stays: kyotoStays,
    tags: ["snow", "architecture", "stargazing"],
    style: "nature",
    rating: 4.8,
    estimatedDailyCost: 230,
    bestMonths: ["Jan", "Feb", "Dec"],
  },
  {
    id: "yunnan-tea",
    name: "High Mountain Tea",
    country: "China",
    region: "Asia",
    description:
      "An intimate journey through ancient tea terraces and mountain rituals.",
    image: "linear-gradient(135deg, #b7d7a8 0%, #3f6f55 50%, #14261d 100%)",
    imageSrc: "/images/editorial/destination-yunnan-tea.png",
    imageAlt: "Ceramic teapot with steam rising against a deep green tea terrace backdrop.",
    heroImageSrc: "/images/editorial/destination-yunnan-tea.png",
    heroImageAlt: "Steaming ceramic teapot with mountain tea greenery in the background.",
    editorialTitle: "Yunnan: High Mountain Tea",
    detailSummary:
      "A tactile route for tea houses, mountain terraces, and slow conversations at the table.",
    detailDescription:
      "The Yunnan tea route is less about checking off scenery and more about rhythm: walking terraces, sitting with producers, and understanding time through taste.",
    decisions: [
      {
        label: "Producer visit",
        title: "Morning table tasting",
        description: "Start with one family-run tasting before the mountain roads fill.",
      },
      {
        label: "Terrace walk",
        title: "Short trail above the village",
        description: "Keep the walk short enough that conversation stays possible.",
      },
      {
        label: "Market stop",
        title: "Compressed shopping window",
        description: "Buy tea after tasting, not before, so the choices are grounded.",
      },
    ],
    stays: kyotoStays,
    tags: ["tea", "mountains", "ritual"],
    style: "food",
    rating: 4.5,
    estimatedDailyCost: 150,
    bestMonths: ["Apr", "May", "Oct"],
  },
  {
    id: "provence",
    name: "Summer in Provence",
    country: "France",
    region: "Europe",
    description:
      "Lavender roads, limestone villages, and a measured budget for slow summer days.",
    image: "linear-gradient(135deg, #d7b9e8 0%, #8d7aa8 45%, #6f4627 100%)",
    imageSrc: "/images/editorial/destination-provence.png",
    imageAlt: "Lavender rows leading toward a pale stone village in Provence.",
    heroImageSrc: "/images/editorial/destination-provence.png",
    heroImageAlt: "Summer Provence countryside with lavender, cypress trees, and a stone village.",
    editorialTitle: "Provence: The Lavender Ledger",
    detailSummary:
      "A 14-day itinerary shaped around market mornings, rail efficiency, and budget clarity.",
    detailDescription:
      "Provence rewards deliberate sequencing. The strongest plans use one village as an anchor, then adjust dining, transit, and lodging choices around seasonal light and market days.",
    decisions: [
      {
        label: "Market morning",
        title: "Lourmarin before lunch",
        description: "Build the day around one market rather than splitting attention between towns.",
      },
      {
        label: "Rail pass",
        title: "Use a 10-day regional pass",
        description: "Reduce transfer cost without forcing every day onto a train.",
      },
      {
        label: "Lavender timing",
        title: "Shift Valensole by two days",
        description: "Catch the strongest bloom window and avoid the weekend road peak.",
      },
    ],
    stays: kyotoStays,
    tags: ["lavender", "markets", "rail"],
    style: "food",
    rating: 4.7,
    estimatedDailyCost: 205,
    bestMonths: ["Jun", "Jul", "Sep"],
  },
];

export const destinationRegions = Array.from(
  new Set(destinations.map((destination) => destination.region)),
).sort();

export function getDestinationById(id: string) {
  return destinations.find((destination) => destination.id === id);
}
