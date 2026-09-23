import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(40),
  requestedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  partySize: z.coerce.number().int().min(1).max(40),
  shipName: z.string().trim().max(120).optional().default(""),
  questions: z.string().trim().max(2000).optional().default(""),
  website: z.string().max(0).optional().default(""),
});

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char);

export const Route = createFileRoute("/api/public/tour-inquiry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = inquirySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Please check the highlighted fields." }, { status: 400 });
        if (parsed.data.website) return Response.json({ sent: true });

        const lovableKey = process.env["LOVABLE_API_KEY"];
        const resendKey = process.env["RESEND_API_KEY"];
        if (!lovableKey || !resendKey) return Response.json({ error: "Email delivery is not configured yet." }, { status: 503 });

        const d = parsed.data;
        const rows = [
          ["Name", d.name], ["Email", d.email], ["Phone", d.phone],
          ["Requested Date", d.requestedDate], ["Number in Party", String(d.partySize)],
          ["Ship Name", d.shipName || "Not provided"],
          ["Questions / Special Requests", d.questions || "None"],
        ];
        const text = `New Cat’s Ride Mazatlan Tour Inquiry\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}`;
        const htmlRows = rows.map(([label, value]) => `<tr><td style="padding:10px 14px;font-weight:700;color:#062c56;border-bottom:1px solid #dde7ec">${escapeHtml(label)}</td><td style="padding:10px 14px;border-bottom:1px solid #dde7ec">${escapeHtml(value)}</td></tr>`).join("");

        const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": resendKey,
          },
          body: JSON.stringify({
            from: "Cat’s Ride Mazatlan <bookings@catsridemazatlan.com>",
            to: ["bookings@catsridemazatlan.com"],
            reply_to: d.email,
            subject: "New Cat’s Ride Mazatlan Tour Inquiry",
            text,
            html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto"><h1 style="color:#062c56">New Cat’s Ride Mazatlan Tour Inquiry</h1><table style="width:100%;border-collapse:collapse">${htmlRows}</table></div>`,
          }),
        });

        if (!response.ok) {
          const detail = await response.text();
          console.error(`Resend delivery failed [${response.status}]: ${detail}`);
          return Response.json({ error: "We couldn’t send your request. Please call or email Martin directly." }, { status: 502 });
        }
        return Response.json({ sent: true });
      },
    },
  },
});