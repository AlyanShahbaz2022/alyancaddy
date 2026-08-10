import "server-only";

import { PrismaClient } from "@prisma/client";

// Cache the client on the global object in dev to avoid exhausting the
// connection pool across Next.js hot reloads. On serverless (Vercel) a new
// module instance is created per cold start, which is expected.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
