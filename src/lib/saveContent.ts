import "server-only";

import { prisma } from "@/lib/prisma";
import { CONTENT_ID } from "@/lib/getContent";
import { contentSchema, type Content } from "@/types/content";

/** Thrown when the stored content changed after the editor loaded it. */
export class ContentConflictError extends Error {
  constructor() {
    super("Content was changed elsewhere since this editor was loaded");
    this.name = "ContentConflictError";
  }
}

/** Version token for optimistic concurrency: the row's updatedAt. */
export async function getContentVersion(): Promise<string> {
  const row = await prisma.siteContent.findUnique({
    where: { id: CONTENT_ID },
    select: { updatedAt: true },
  });
  return row?.updatedAt.toISOString() ?? "";
}

/**
 * Saves the whole content document. When `expectedVersion` is given, the
 * write only succeeds if nobody saved in the meantime — otherwise an editor
 * tab opened earlier would silently overwrite newer changes.
 */
export async function saveContent(
  input: unknown,
  expectedVersion?: string
): Promise<{ content: Content; version: string }> {
  const parsed = contentSchema.parse(input);

  if (expectedVersion) {
    const { count } = await prisma.siteContent.updateMany({
      where: { id: CONTENT_ID, updatedAt: new Date(expectedVersion) },
      data: { data: parsed },
    });
    if (count === 0) throw new ContentConflictError();
  } else {
    await prisma.siteContent.upsert({
      where: { id: CONTENT_ID },
      create: { id: CONTENT_ID, data: parsed },
      update: { data: parsed },
    });
  }

  return { content: parsed, version: await getContentVersion() };
}
