import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_tour_info",
  title: "Get tour information",
  description:
    "Get details about Cat's Ride Mazatlan private tours: what's included, popular stops, drinks, group capacity, policies, and how to contact Martin.",
  inputSchema: {},
  outputSchema: {
    summary: z.string(),
    capacity: z.string(),
    popularStops: z.array(z.string()),
    drinks: z.string(),
    policies: z.array(z.string()),
    contact: z.object({ phone: z.string(), email: z.string(), facebook: z.string() }),
  },
  handler: () => ({
    content: [
      {
        type: "text",
        text: "Cat's Ride Mazatlan offers fully private, customizable tours of Mazatlán, Mexico with local guide Martin. Capacity 1–4 people per car. No deposit required — pay only at the end. Contact: +01 6691647788 or bookings@catsridemazatlan.com.",
      },
    ],
    structuredContent: {
      summary:
        "Fully private, personalized tours of Mazatlán, Sinaloa, Mexico with local guide and driver Martin. Customizable itinerary around your interests and available time.",
      capacity: "1–4 people per car",
      popularStops: [
        "Lighthouse (optional)",
        "Liverpool Alley (colorful umbrella-covered street)",
        "Cliff Divers Show",
        "Historic Center & Beautiful Cathedral",
        "Municipal Market",
        "Relax at a stunning beach (pool & resort access where available)",
      ],
      drinks: "Water, sodas, Pacifico beer and local tequila.",
      policies: [
        "Fully private tours — only your group",
        "Customizable itinerary",
        "No deposit required; pay only at the end of the tour",
        "Flexible tour lengths",
        "Capacity: 1–4 people per car",
      ],
      contact: {
        phone: "+016691647788",
        email: "bookings@catsridemazatlan.com",
        facebook: "https://www.facebook.com/share/1GJbJEeeTo/?mibextid=wwXIfr",
      },
    },
  }),
});
