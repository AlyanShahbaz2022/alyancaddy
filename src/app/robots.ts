import type { MetadataRoute } from "next";

import { getContent } from "@/lib/getContent";
import { siteUrl } from "@/lib/seo";

// Built per request so the sitemap URL follows the admin "Site URL".
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = siteUrl(await getContent());
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
