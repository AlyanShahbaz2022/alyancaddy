import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { contentSchema, type Content } from "@/types/content";

export const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export async function getContent(): Promise<Content> {
  const raw = await readFile(CONTENT_PATH, "utf8");
  return contentSchema.parse(JSON.parse(raw));
}