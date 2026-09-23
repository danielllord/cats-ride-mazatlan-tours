import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { inquirySchema, sendTourInquiry } from "../../tour-inquiry.server";

export default defineTool({
  name: "submit_tour_inquiry",
  title: "Submit a tour inquiry",
  description:
    "Send a tour inquiry to Martin at Cat's Ride Mazatlan. He replies with tour information and a quote. No payment or deposit is taken. All fields except shipName and questions are required.",
  inputSchema: {
    name: z.string().trim().min(2).max(100).describe("Customer full name"),
    email: z.string().trim().email().max(255).describe("Customer email — used as the reply-to address"),
    phone: z.string().trim().min(7).max(40).describe("Customer phone number"),
    requestedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Requested tour date, YYYY-MM-DD"),
    partySize: z.number().int().min(1).max(40).describe("Number of people in the party"),
    shipName: z.string().trim().max(120).optional().describe("Cruise ship name, if applicable"),
    questions: z.string().trim().max(2000).optional().describe("Questions or special requests"),
  },
  handler: async (args) => {
    const parsed = inquirySchema.safeParse(args);
    if (!parsed.success) {
      return {
        isError: true,
        content: [{ type: "text", text: "Invalid inquiry: please check name, email, phone, date (YYYY-MM-DD), and party size." }],
      };
    }
    const result = await sendTourInquiry(parsed.data);
    if (!result.ok) {
      return {
        isError: true,
        content: [{ type: "text", text: `${result.error} You can also reach Martin at +01 6691647788 or bookings@catsridemazatlan.com.` }],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: "Thanks! The request has been sent to Martin. He'll be in touch soon to help plan the Mazatlán adventure.",
        },
      ],
    };
  },
});
