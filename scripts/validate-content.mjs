import { readFile } from "node:fs/promises";
import { contentSchema } from "../src/types/content.ts";

const raw = await readFile(new URL("../data/content.json", import.meta.url), "utf8");
const parsed = contentSchema.parse(JSON.parse(raw));

console.log("content.json is valid.");
console.log("Brand:", parsed.site.brandDisplay);
console.log(
  "Projects:",
  parsed.portfolio.items.length,
  "| Services:",
  parsed.services.items.length,
  "| FAQs:",
  parsed.faqs.items.length,
  "| Socials:",
  parsed.socials.length
);