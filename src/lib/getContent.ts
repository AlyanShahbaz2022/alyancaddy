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
  return normalizeContent(contentSchema.parse(JSON.parse(raw)));
}

// "www.linkedin.com/in/x" without a scheme is treated by browsers as a
// relative path on this site; give bare domains an https:// prefix.
export function externalUrl(value: string): string {
  const url = value.trim();
  if (!url || /^([a-z][a-z0-9+.-]*:|\/|#)/i.test(url)) return url;
  return /^[\w-]+(\.[\w-]+)+/.test(url) ? `https://${url}` : url;
}

function normalizeContent(content: Content): Content {
  return {
    ...content,
    socials: content.socials.map((social) => ({
      ...social,
      url: externalUrl(social.url),
    })),
    portfolio: {
      ...content.portfolio,
      items: content.portfolio.items.map((project) => ({
        ...project,
        url: externalUrl(project.url),
      })),
    },
  };
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

  return normalizeContent(contentSchema.parse(row.data));
}
