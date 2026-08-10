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
  const ALLOWED_FOLDERS = ["profile", "portfolio"] as const;
  const BASE_FOLDER = "alyan caddy portfolio images";
  const requested = String(formData?.get("folder") ?? "");
  const sub = (ALLOWED_FOLDERS as readonly string[]).includes(requested)
    ? requested
    : "profile";
  const folder = `${BASE_FOLDER}/${sub}`;

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type || "image/png"};base64,${bytes.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image",
      overwrite: true,
    });
    return Response.json({ url: result.secure_url });
  } catch (error) {
    console.error("[admin/upload] failed", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}