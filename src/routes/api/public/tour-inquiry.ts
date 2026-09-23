import { createFileRoute } from "@tanstack/react-router";

import { inquirySchema, sendTourInquiry } from "@/lib/tour-inquiry.server";

export const Route = createFileRoute("/api/public/tour-inquiry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = inquirySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Please check the highlighted fields." }, { status: 400 });
        if (parsed.data.website) return Response.json({ sent: true });

        const result = await sendTourInquiry(parsed.data);
        if (!result.ok) return Response.json({ error: result.error }, { status: result.status });
        return Response.json({ sent: true });
      },
    },
  },
});
