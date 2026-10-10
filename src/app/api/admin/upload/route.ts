import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import { isAdmin } from "@/lib/adminAuth";

export async function POST(request: NextRequest): Promise<Response> {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return Response.json(
      { error: "Cloudinary is not configured" },
      { status: 500 }
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  // Only allow a fixed set of folders so clients can't write anywhere.
  const ALLOWED_FOLDERS = ["profile", "portfolio", "documents"] as const;
  const BASE_FOLDER = "alyan caddy portfolio images";
  const requested = String(formData?.get("folder") ?? "");
  const sub = (ALLOWED_FOLDERS as readonly string[]).includes(requested)
    ? requested
    : "profile";
  const folder = `${BASE_FOLDER}/${sub}`;

  const isImage = (file.type || "").startsWith("image/");
  if (!isImage && sub !== "documents") {
    return Response.json({ error: "Only images are allowed here" }, { status: 400 });
  }

  const extension = (file.name.split(".").pop() || "").toLowerCase();
  if (!isImage && !ALLOWED_DOCUMENT_EXTENSIONS.has(extension)) {
    return Response.json({ error: "Unsupported file type" }, { status: 400 });
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type || "application/octet-stream"};base64,${bytes.toString("base64")}`;
    // Non-image documents (PDF, Word, …) go up as "raw" so Cloudinary serves
    // the original file untouched; raw public IDs must carry the extension.
    const result = await cloudinary.uploader.upload(
      dataUri,
      isImage
        ? { folder, resource_type: "image", overwrite: true }
        : {
            folder,
            resource_type: "raw",
            public_id: `${slugify(file.name)}-${Date.now().toString(36)}.${extension}`,
          }
    );
    return Response.json({ url: result.secure_url, name: file.name });
  } catch (error) {
    console.error("[admin/upload] failed", error);
    // Surface Cloudinary's reason (e.g. "Invalid api_key", "File size too
    // large") so the admin sees what actually went wrong.
    const reason =
      (error as { error?: { message?: string }; message?: string })?.error?.message ??
      (error as { message?: string })?.message;
    return Response.json(
      { error: reason ? `Upload failed: ${reason}` : "Upload failed" },
      { status: 500 }
    );
  }
}

const ALLOWED_DOCUMENT_EXTENSIONS = new Set([
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "txt",
]);

function slugify(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, "");
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "document"
  );
}
