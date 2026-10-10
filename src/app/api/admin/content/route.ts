import { NextRequest } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { getContent } from "@/lib/getContent";
import { ContentConflictError, saveContent } from "@/lib/saveContent";
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
    const expectedVersion = request.headers.get("x-content-version") || undefined;
    const saved = await saveContent(body, expectedVersion);
    revalidatePath("/", "layout");
    return Response.json({ ok: true, ...saved });
  } catch (error) {
    if (error instanceof ContentConflictError) {
      return Response.json(
        {
          error:
            "Content was changed in another tab or session. Reload the page to get the latest version, then redo your edit.",
        },
        { status: 409 }
      );
    }
    return Response.json(
      { error: "Invalid content payload", detail: String(error) },
      { status: 400 }
    );
  }
}