import { NextRequest } from "next/server";

import {
  createAdminSession,
  destroyAdminSession,
  isAdmin,
} from "@/lib/adminAuth";

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json().catch(() => ({}));

  if (body?.action === "logout") {
    if (await isAdmin()) {
      await destroyAdminSession();
    }
    return Response.json({ ok: true });
  }

  const password = String(body?.password ?? "");
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  await createAdminSession();
  return Response.json({ ok: true });
}