import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

import { prisma } from "@/lib/prisma";
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

  // 1) Persist first so a submission is never lost even if the email fails.
  try {
    await prisma.submission.create({
      data: { name, email, service, message },
    });
  } catch (error) {
    console.error("[contact] failed to save submission", error);
    return Response.json(
      { error: "Failed to save your request" },
      { status: 500 }
    );
  }

  // 2) Send a notification email via Gmail SMTP (best-effort).
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_TO_EMAIL || user;

  if (!user || !pass) {
    console.warn(
      "[contact] Gmail SMTP not configured. Submission saved but not emailed.",
      { name, email, service }
    );
    return Response.json({ ok: true, emailed: false });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"Portfolio Inquiry" <${user}>`,
      to,
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
    return Response.json({ ok: true, emailed: true });
  } catch (error) {
    // Submission is already saved; report success but note email failure.
    console.error("[contact] failed to send email", error);
    return Response.json({ ok: true, emailed: false });
  }
}
