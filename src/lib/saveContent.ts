import "server-only";

import { writeFile } from "node:fs/promises";

import { contentSchema, type Content } from "@/types/content";
import { CONTENT_PATH } from "@/lib/getContent";

export async function saveContent(input: unknown): Promise<Content> {
  const parsed = contentSchema.parse(input);
  await writeFile(CONTENT_PATH, JSON.stringify(parsed, null, 2), "utf8");
  return parsed;
}