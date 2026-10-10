import type { MetadataRoute } from "next";

import { CONTENT_ID, getContent } from "@/lib/getContent";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  const base = siteUrl(content);
  const row = await prisma.siteContent
    .findUnique({ where: { id: CONTENT_ID }, select: { updatedAt: true } })
    .catch(() => null);

  const images = [content.hero.image, content.about.image]
    .filter(Boolean)
    .map((image) => absoluteUrl(base, image));

  return [
    {
      url: `${base}/`,
      lastModified: row?.updatedAt ?? new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [...new Set(images)],
    },
  ];
}
