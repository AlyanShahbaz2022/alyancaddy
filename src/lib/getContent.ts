import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { prisma } from "@/lib/prisma";
import { contentSchema, type Content } from "@/types/content";

export const CONTENT_ID = "singleton";

// Kept for the seed script and as a fallback source when the DB row is missing.
export const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

async function readContentFile(): Promise<Content> {
  const raw = await readFile(CONTENT_PATH, "utf8");
  return contentSchema.parse(JSON.parse(raw));
}

export async function getContent(): Promise<Content> {
  const row = await prisma.siteContent.findUnique({
    where: { id: CONTENT_ID },
  });

  // Fresh database (not yet seeded): fall back to the committed JSON so the
  // site still renders. Run the seed to persist it into Postgres.
  if (!row) {
    return readContentFile();
  }

  return contentSchema.parse(row.data);
}
