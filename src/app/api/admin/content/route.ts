import { NextRequest } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { getContent } from "@/lib/getContent";
import { saveContent } from "@/lib/saveContent";
import { revalidatePath } from "next/cache";

export async function GET(): Promise<Response> {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await getContent();
  return Response.json(content);
}

export async function PUT(request: NextRequest): Promise<Response> {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const saved = await saveContent(body);
    revalidatePath("/", "layout");
    return Response.json({ ok: true, content: saved });
  } catch (error) {
    return Response.json(
      { error: "Invalid content payload", detail: String(error) },
      { status: 400 }
    );
  }
}