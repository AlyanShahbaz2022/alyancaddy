import { gradients, iconNames } from "@/types/content";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "boolean"
  | "image"
  | "object"
  | "list";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  fields?: FieldDef[];
  factory?: () => unknown;
  placeholder?: string;
  itemLabel?: string;
};

export type AdminGroup = {
  key: string;
  label: string;
  fields: FieldDef[];
};

function newId(): string {
  return `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const text = (
  key: string,
  label: string,
  placeholder?: string
): FieldDef => ({ key, label, type: "text", placeholder });
const area = (key: string, label: string): FieldDef => ({
  key,
  label,
  type: "textarea",
});
const number = (key: string, label: string): FieldDef => ({
  key,
  label,
  type: "number",
});
const boolean = (key: string, label: string): FieldDef => ({
  key,
  label,
  type: "boolean",
});
const image = (key: string, label: string): FieldDef => ({
  key,
  label,
  type: "image",
});
const select = (
  key: string,
  label: string,
  options: readonly string[]
): FieldDef => ({ key, label, type: "select", options });
const object = (key: string, label: string, fields: FieldDef[]): FieldDef => ({
  key,
  label,
  type: "object",
  fields,
});
const list = (
  key: string,
  label: string,
  factory: () => unknown,
  fields?: FieldDef[],
  itemLabel?: string
): FieldDef => ({
  key,
  label,
  type: "list",
  factory,
  fields,
  itemLabel,
});

const newLink = () => ({ label: "", href: "" });
const newStat = () => ({ value: 0, suffix: "+", label: "" });
const newHeroCard = () => ({ id: newId(), value: "", label: "" });
const newService = () => ({
  id: newId(),
  icon: "code" as const,
  title: "",
  description: "",
  tags: [] as string[],
  cta: newLink(),
});
const newProject = () => ({
  id: newId(),
  title: "",
  category: "",
  filter: "WEB DEV",
  icon: "globe" as const,
  gradient: "blue" as const,
  watermark: "",
  url: "",
  problem: "",
  built: "",
  result: "",
  tech: [] as string[],
  wide: false,
  isMockup: false,
  liveBadge: "",
  image: "",
});
const newFaq = () => ({ id: newId(), question: "", answer: "" });
const newSocial = () => ({
  id: newId(),
  name: "",
  icon: "linkedin" as const,
  url: "",
});
const newString = () => "";

const linkFields: FieldDef[] = [text("label", "Label"), text("href", "Href")];
const filterOptions = ["WEB DEV", "SHOPIFY", "APP DEV"] as const;
const socialIcons = ["linkedin", "instagram", "tiktok"] as const;

export const ADMIN_GROUPS: AdminGroup[] = [
  {
    key: "site",
    label: "Site",
    fields: [
      text("brand", "Brand"),
      text("brandDisplay", "Brand (display)"),
      text("name", "Name"),
      text("title", "Meta title"),
      area("description", "Meta description"),
    ],
  },
  {
    key: "nav",
    label: "Navigation",
    fields: [
      text("logo", "Logo text"),
      list("links", "Nav links", newLink, linkFields, "Link"),
      object("hire", "Hire button", linkFields),
    ],
  },
  {
    key: "hero",
    label: "Hero",
    fields: [
      text("eyebrow", "Eyebrow"),
      text("availability", "Availability badge"),
      text("headline", "Headline (wrap a word in ** ** for red)"),
      area("description", "Description"),
      object("primaryCta", "Primary button", linkFields),
      object("secondaryCta", "Secondary button", linkFields),
      image("image", "Hero photo"),
      list("cards", "Floating badges", newHeroCard, [
        text("value", "Value"),
        text("label", "Label"),
      ], "Badge"),
    ],
  },
  {
    key: "stats",
    label: "Stats",
    fields: [
      text("eyebrow", "Eyebrow"),
      text("heading", "Heading"),
      text("watermark", "Watermark text"),
      list("items", "Stats", newStat, [
        number("value", "Value"),
        text("suffix", "Suffix (e.g. +)"),
        text("label", "Label"),
      ], "Stat"),
    ],
  },
  {
    key: "about",
    label: "About",
    fields: [
      text("eyebrow", "Eyebrow"),
      text("heading", "Heading"),
      text("name", "Name"),
      text("location", "Location"),
      list("bio", "Bio paragraphs", newString, undefined, "Paragraph"),
      image("image", "Photo"),
      text("ribbon", "Ribbon badge"),
      list("tags", "Tech pills", newString, undefined, "Tag"),
      list("checklist", "Checklist", newString, undefined, "Item"),
      object("cta", "Button", linkFields),
    ],
  },
  {
    key: "services",
    label: "Services",
    fields: [
      text("eyebrow", "Eyebrow"),
      text("heading", "Heading"),
      text("watermark", "Watermark text"),
      area("intro", "Intro"),
      list("items", "Services", newService, [
        select("icon", "Icon", iconNames),
        text("title", "Title"),
        area("description", "Description"),
        list("tags", "Tags", newString, undefined, "Tag"),
        object("cta", "Button", linkFields),
      ], "Service"),
    ],
  },
  {
    key: "portfolio",
    label: "Portfolio",
    fields: [
      text("eyebrow", "Eyebrow"),
      text("heading", "Heading"),
      text("subtext", "Subtext"),
      text("watermark", "Watermark text"),
      list("filters", "Filter tabs", newString, undefined, "Filter"),
      text("viewLabel", "Cursor label (view)"),
      text("voiceLabel", "Cursor label (voice)"),
      list("items", "Projects", newProject, [
        text("title", "Title"),
        text("category", "Category label"),
        select("filter", "Filter tab", filterOptions),
        select("icon", "Icon", iconNames),
        select("gradient", "Gradient", gradients),
        text("watermark", "Watermark"),
        text("url", "URL"),
        area("problem", "Problem"),
        area("built", "Built"),
        area("result", "Result"),
        list("tech", "Tech tags", newString, undefined, "Tag"),
        boolean("wide", "Full-width card"),
        boolean("isMockup", "Show app mockup"),
        text("liveBadge", "Live badge (e.g. LIVE ON...)"),
        image("image", "Screenshot"),
      ], "Project"),
    ],
  },
  {
    key: "marquee",
    label: "Marquee",
    fields: [list("items", "Marquee items", newString, undefined, "Item")],
  },
  {
    key: "faqs",
    label: "FAQs",
    fields: [
      text("eyebrow", "Eyebrow"),
      text("heading", "Heading"),
      text("watermark", "Watermark text"),
      area("description", "Description"),
      object("cta", "Button", linkFields),
      list("items", "Questions", newFaq, [
        text("question", "Question"),
        area("answer", "Answer"),
      ], "Question"),
    ],
  },
  {
    key: "cta",
    label: "CTA",
    fields: [
      text("eyebrow", "Eyebrow"),
      text("heading", "Heading"),
      area("description", "Description"),
      object("button", "Button", linkFields),
    ],
  },
  {
    key: "contact",
    label: "Contact",
    fields: [
      text("eyebrow", "Eyebrow"),
      text("heading", "Heading"),
      area("description", "Description"),
      text("email", "Email"),
      text("location", "Location"),
      object("phone", "Phone", [
        text("number", "Number"),
        boolean("protected", "Protected (reveal on click)"),
        text("protectedLabel", "Protected label"),
      ]),
      list("serviceOptions", "Service options", newString, undefined, "Option"),
      object("form", "Form labels", [
        text("nameLabel", "Name label"),
        text("namePlaceholder", "Name placeholder"),
        text("emailLabel", "Email label"),
        text("emailPlaceholder", "Email placeholder"),
        text("serviceLabel", "Service label"),
        text("servicePlaceholder", "Service placeholder"),
        text("messageLabel", "Message label"),
        text("messagePlaceholder", "Message placeholder"),
        text("submitLabel", "Submit label"),
      ]),
      text("toastSuccess", "Success toast"),
      text("toastError", "Error toast"),
      text("sendingLabel", "Sending label"),
    ],
  },
  {
    key: "footer",
    label: "Footer",
    fields: [
      area("tagline", "Tagline"),
      list("services", "Service links", newLink, linkFields, "Link"),
      text("rights", "Rights text"),
      text("builtWith", "Built with"),
    ],
  },
  {
    key: "socials",
    label: "Socials",
    fields: [
      list("__root__", "Social links", newSocial, [
        text("name", "Name"),
        select("icon", "Icon", socialIcons),
        text("url", "URL"),
      ], "Social"),
    ],
  },
];