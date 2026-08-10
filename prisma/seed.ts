import { readFile } from "node:fs/promises";
import path from "node:path";

import { PrismaClient } from "@prisma/client";

import { contentSchema } from "../src/types/content.ts";

const CONTENT_ID = "singleton";
const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

const prisma = new PrismaClient();

async function main() {
  const raw = await readFile(CONTENT_PATH, "utf8");
  const parsed = contentSchema.parse(JSON.parse(raw));

  await prisma.siteContent.upsert({
    where: { id: CONTENT_ID },
    create: { id: CONTENT_ID, data: parsed },
    update: { data: parsed },
  });

  console.log(`Seeded SiteContent row "${CONTENT_ID}" from ${CONTENT_PATH}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
