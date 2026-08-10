import "server-only";

import { prisma } from "@/lib/prisma";
import { CONTENT_ID } from "@/lib/getContent";
import { contentSchema, type Content } from "@/types/content";

export async function saveContent(input: unknown): Promise<Content> {
  const parsed = contentSchema.parse(input);

  await prisma.siteContent.upsert({
    where: { id: CONTENT_ID },
    create: { id: CONTENT_ID, data: parsed },
    update: { data: parsed },
  });

  return parsed;
}
