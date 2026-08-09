import { NextRequest } from "next/server";
import { Resend } from "resend";

import { contactFormSchema } from "@/lib/contact";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json().catch(() => null);
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid submission", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, service, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY is not configured. Message was received but not emailed.",
      { name, email, service }
    );
    return Response.json({ ok: true, preview: true });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: from,
      replyTo: email,
      subject: `New inquiry — ${service}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Service:</strong> ${escapeHtml(service)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message)}</p>
      `,
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[contact] failed to send email", error);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}