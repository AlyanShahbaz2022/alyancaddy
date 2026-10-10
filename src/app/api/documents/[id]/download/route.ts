import { NextRequest } from "next/server";

import { getContent } from "@/lib/getContent";

// Streams a document back from our own origin with an attachment header.
// Browsers ignore the `download` attribute on cross-origin links (e.g.
// Cloudinary), so without this the file would just open instead of saving.
// Only files listed in the documents section can be fetched — this is not
// an open proxy.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  const content = await getContent();
  const doc = content.documents.items.find((item) => item.id === id);

  if (!doc || !doc.file.trim()) {
    return Response.json({ error: "Document not found" }, { status: 404 });
  }

  let source: URL;
  try {
    source = new URL(doc.file, request.nextUrl.origin);
  } catch {
    return Response.json({ error: "Invalid document URL" }, { status: 400 });
  }
  if (source.protocol !== "https:" && source.protocol !== "http:") {
    return Response.json({ error: "Invalid document URL" }, { status: 400 });
  }

  const upstream = await fetch(source).catch(() => null);
  if (!upstream?.ok || !upstream.body) {
    return Response.json({ error: "Could not fetch document" }, { status: 502 });
  }

  const filename = downloadName(doc.fileName, doc.title, source.pathname);
  const headers = new Headers({
    "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
    "Content-Disposition": `attachment; filename="${filename.replace(/[^\x20-\x7e]|"/g, "_")}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    "Cache-Control": "private, max-age=0, must-revalidate",
  });
  const length = upstream.headers.get("content-length");
  if (length) headers.set("Content-Length", length);

  return new Response(upstream.body, { headers });
}

// Uses the admin-set file name (falling back to the title) and makes sure it
// ends with the real file's extension so it opens correctly once saved.
function downloadName(fileName: string, title: string, pathname: string): string {
  const ext = pathname.match(/\.([a-z0-9]{2,5})$/i)?.[0] ?? "";
  const base =
    (fileName.trim() || title.trim()).replace(/[\\/:*?"<>|]+/g, "-") || "document";
  if (!ext || base.toLowerCase().endsWith(ext.toLowerCase())) return base;
  return `${base}${ext}`;
}
