import "server-only";

import type { Content } from "@/types/content";

/**
 * Public origin used for canonical URLs, Open Graph, sitemap and JSON-LD.
 * Priority: admin "Site URL" → NEXT_PUBLIC_SITE_URL → Vercel production
 * domain (set automatically on Vercel) → localhost for development.
 */
export function siteUrl(content: Content): string {
  const candidates = [
    content.site.url,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ];
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;
    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withScheme).origin;
    } catch {
      // ignore malformed values and fall through
    }
  }
  return "http://localhost:3000";
}

export function absoluteUrl(base: string, value: string): string {
  if (!value) return "";
  try {
    return new URL(value, base).toString();
  } catch {
    return value;
  }
}

/** Strips the `**highlight**` markers used in headings. */
export function plainText(value: string): string {
  return value.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
}

const DEFAULT_KEYWORDS = [
  "Full-Stack Developer",
  "Shopify Expert",
  "Shopify Store Setup",
  "Web Developer in Pakistan",
  "Next.js Developer",
  "React Developer",
  "Mobile App Developer",
  "Flutter Developer",
  "Freelance Web Developer",
  "UGC Content Creator",
];

export function seoKeywords(content: Content): string[] {
  const words = [
    content.site.name,
    content.site.brandDisplay,
    content.site.brand,
    ...content.site.keywords,
    ...(content.site.keywords.length ? [] : DEFAULT_KEYWORDS),
    ...content.services.items.map((service) => service.title),
    ...content.about.tags,
  ];
  const seen = new Set<string>();
  return words
    .map((word) => word.trim())
    .filter((word) => {
      const key = word.toLowerCase();
      if (!word || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/** First "City, Country" style parts of the about location. */
function parseLocation(location: string): { locality: string; country: string } {
  const parts = location.split(",").map((part) => part.trim()).filter(Boolean);
  const country = parts.length > 1 ? parts[parts.length - 1] : "";
  const locality = (parts[0] ?? "").split("/")[0].trim();
  return { locality, country };
}

/** schema.org graph: Person, WebSite, ProfessionalService and FAQPage. */
export function buildJsonLd(content: Content) {
  const base = siteUrl(content);
  const personId = `${base}/#person`;
  const websiteId = `${base}/#website`;
  const { locality, country } = parseLocation(content.about.location);
  const image = absoluteUrl(base, content.about.image || content.hero.image);
  const sameAs = content.socials
    .map((social) => social.url)
    .filter((url) => /^https?:\/\//i.test(url) && !/^https?:\/\/(www\.)?[^/]+\/?$/i.test(url));

  const address = locality || country
    ? {
        "@type": "PostalAddress",
        ...(locality ? { addressLocality: locality } : {}),
        ...(country ? { addressCountry: country } : {}),
      }
    : undefined;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Person",
      "@id": personId,
      name: content.site.name,
      alternateName: content.site.brandDisplay,
      url: base,
      ...(image ? { image } : {}),
      jobTitle: plainText(content.hero.eyebrow) || "Full-Stack Developer",
      description: content.site.description,
      ...(content.contact.email ? { email: `mailto:${content.contact.email}` } : {}),
      ...(address ? { address } : {}),
      knowsAbout: [
        ...content.services.items.map((service) => service.title),
        ...content.about.tags,
      ],
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: base,
      name: content.site.brandDisplay,
      alternateName: content.site.name,
      description: content.site.description,
      inLanguage: "en",
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${base}/#service`,
      name: `${content.site.brandDisplay} — ${content.site.name}`,
      url: base,
      ...(image ? { image } : {}),
      description: content.site.description,
      founder: { "@id": personId },
      ...(address ? { address } : {}),
      areaServed: "Worldwide",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: content.services.items.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.description,
          },
        })),
      },
    },
  ];

  const faqs = content.faqs.items.filter((faq) => faq.question && faq.answer);
  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${base}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** Serialises JSON-LD safely for an inline <script> tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
