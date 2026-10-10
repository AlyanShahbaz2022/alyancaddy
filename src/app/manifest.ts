import type { MetadataRoute } from "next";

import { getContent } from "@/lib/getContent";
import { plainText } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const content = await getContent();
  return {
    name: plainText(content.site.title) || content.site.brandDisplay,
    short_name: content.site.brandDisplay,
    description: content.site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: content.nav.logoImage || "/images/Logo.jpeg",
        sizes: "any",
      },
    ],
  };
}
