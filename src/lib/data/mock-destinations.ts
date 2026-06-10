import type { Destination } from "@/types/travel";

export const destinations: Destination[] = [
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    description:
      "Temple gardens, lantern-lit lanes, and slow mornings between mountain shrines.",
    image: "linear-gradient(135deg, #f7c8a0 0%, #d9896a 45%, #59332e 100%)",
    tags: ["temples", "tea houses", "spring blooms"],
    style: "culture",
    rating: 4.9,
    estimatedDailyCost: 210,
    bestMonths: ["Mar", "Apr", "Nov"],
  },
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    region: "Europe",
    description:
      "Tiled viewpoints, Atlantic seafood, vintage trams, and golden evening light.",
    image: "linear-gradient(135deg, #f6d365 0%, #fda085 50%, #325d79 100%)",
    tags: ["coast", "wine", "walkable"],
    style: "food",
    rating: 4.7,
    estimatedDailyCost: 165,
    bestMonths: ["May", "Jun", "Sep"],
  },
  {
    id: "patagonia",
    name: "Patagonia",
    country: "Chile",
    region: "South America",
    description:
      "Glacier-fed lakes, wind-carved peaks, and long trail days under vast skies.",
    image: "linear-gradient(135deg, #a8edea 0%, #5f9ea0 45%, #1d3557 100%)",
    tags: ["hiking", "wildlife", "remote"],
    style: "adventure",
    rating: 4.8,
    estimatedDailyCost: 240,
    bestMonths: ["Dec", "Jan", "Feb"],
  },
  {
    id: "marrakesh",
    name: "Marrakesh",
    country: "Morocco",
    region: "Africa",
    description:
      "Courtyard riads, spice markets, desert day trips, and intricate craft traditions.",
    image: "linear-gradient(135deg, #ffb199 0%, #c8553d 50%, #4a2c2a 100%)",
    tags: ["markets", "design", "desert"],
    style: "culture",
    rating: 4.6,
    estimatedDailyCost: 130,
    bestMonths: ["Mar", "Apr", "Oct"],
  },
  {
    id: "queenstown",
    name: "Queenstown",
    country: "New Zealand",
    region: "Oceania",
    description:
      "Alpine lakes, high-adrenaline day trips, and relaxed evenings by the water.",
    image: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 45%, #235789 100%)",
    tags: ["alpine", "road trips", "adventure"],
    style: "nature",
    rating: 4.8,
    estimatedDailyCost: 230,
    bestMonths: ["Feb", "Mar", "Dec"],
  },
  {
    id: "tulum",
    name: "Tulum",
    country: "Mexico",
    region: "North America",
    description:
      "Turquoise cenotes, beach mornings, Mayan ruins, and barefoot dinners.",
    image: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 55%, #2f4858 100%)",
    tags: ["beach", "wellness", "ruins"],
    style: "relaxation",
    rating: 4.4,
    estimatedDailyCost: 185,
    bestMonths: ["Jan", "Feb", "Nov"],
  },
];

export const destinationRegions = Array.from(
  new Set(destinations.map((destination) => destination.region)),
).sort();
