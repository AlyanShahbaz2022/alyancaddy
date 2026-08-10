import { NextRequest } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET(): Promise<Response> {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json({ submissions });
}

export async function DELETE(request: NextRequest): Promise<Response> {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    await prisma.submission.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
