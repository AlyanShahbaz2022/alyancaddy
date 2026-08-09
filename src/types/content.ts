import { z } from "zod";

export const iconNames = [
  "code",
  "smartphone",
  "shopping-bag",
  "clapperboard",
  "globe",
  "layers",
  "palette",
  "rocket",
  "server",
  "database",
  "lightbulb",
  "camera",
  "sparkles",
  "zap",
  "mail",
  "map-pin",
  "phone",
  "arrow-up-right",
  "arrow-right",
  "arrow-up",
  "check",
  "menu",
  "x",
  "linkedin",
  "instagram",
  "tiktok",
  "music",
  "message-circle",
  "briefcase",
  "user",
  "chevron-down",
  "copy",
  "shield",
  "pen-tool",
  "wand",
  "send",
  "star",
] as const;

export const gradients = [
  "blue",
  "emerald",
  "purple",
  "red",
  "orange",
  "cyan",
] as const;

export const iconNameSchema = z.enum(iconNames);
export const gradientSchema = z.enum(gradients);

export const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const serviceSchema = z.object({
  id: z.string(),
  icon: iconNameSchema,
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  cta: linkSchema,
});

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  filter: z.string(),
  icon: iconNameSchema,
  gradient: gradientSchema,
  watermark: z.string(),
  url: z.string(),
  problem: z.string(),
  built: z.string(),
  result: z.string(),
  tech: z.array(z.string()),
  wide: z.boolean(),
  isMockup: z.boolean(),
  liveBadge: z.string(),
  image: z.string(),
});

export const faqSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const statSchema = z.object({
  value: z.number(),
  suffix: z.string(),
  label: z.string(),
});

export const socialSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: iconNameSchema,
  url: z.string(),
});

export const contentSchema = z.object({
  site: z.object({
    brand: z.string(),
    brandDisplay: z.string(),
    name: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  nav: z.object({
    logo: z.string(),
    links: z.array(linkSchema),
    hire: linkSchema,
  }),
  hero: z.object({
    eyebrow: z.string(),
    availability: z.string(),
    headline: z.string(),
    description: z.string(),
    primaryCta: linkSchema,
    secondaryCta: linkSchema,
    image: z.string(),
    cards: z.array(
      z.object({
        id: z.string(),
        value: z.string(),
        label: z.string(),
      })
    ),
  }),
  stats: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    watermark: z.string(),
    description: z.array(z.string()),
    items: z.array(statSchema),
  }),
  about: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    name: z.string(),
    location: z.string(),
    bio: z.array(z.string()),
    image: z.string(),
    ribbon: z.string(),
    tags: z.array(z.string()),
    checklist: z.array(z.string()),
    cta: linkSchema,
  }),
  services: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    watermark: z.string(),
    intro: z.string(),
    items: z.array(serviceSchema),
  }),
  portfolio: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    subtext: z.string(),
    watermark: z.string(),
    filters: z.array(z.string()),
    viewLabel: z.string(),
    voiceLabel: z.string(),
    items: z.array(projectSchema),
  }),
  marquee: z.object({
    items: z.array(z.string()),
  }),
  faqs: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    watermark: z.string(),
    description: z.string(),
    cta: linkSchema,
    items: z.array(faqSchema),
  }),
  cta: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    description: z.string(),
    button: linkSchema,
  }),
  contact: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    description: z.string(),
    email: z.string(),
    location: z.string(),
    phone: z.object({
      number: z.string(),
      protected: z.boolean(),
      protectedLabel: z.string(),
    }),
    serviceOptions: z.array(z.string()),
    form: z.object({
      nameLabel: z.string(),
      namePlaceholder: z.string(),
      emailLabel: z.string(),
      emailPlaceholder: z.string(),
      serviceLabel: z.string(),
      servicePlaceholder: z.string(),
      messageLabel: z.string(),
      messagePlaceholder: z.string(),
      submitLabel: z.string(),
    }),
    toastSuccess: z.string(),
    toastError: z.string(),
    sendingLabel: z.string(),
  }),
  socials: z.array(socialSchema),
  footer: z.object({
    tagline: z.string(),
    services: z.array(linkSchema),
    rights: z.string(),
    builtWith: z.string(),
  }),
});

export type Content = z.infer<typeof contentSchema>;
export type Link = z.infer<typeof linkSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type Stat = z.infer<typeof statSchema>;
export type Social = z.infer<typeof socialSchema>;
export type IconName = z.infer<typeof iconNameSchema>;
export type Gradient = z.infer<typeof gradientSchema>;