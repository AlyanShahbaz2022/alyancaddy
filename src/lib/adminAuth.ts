import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const COOKIE_NAME = "alyancaddy_admin";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function secret(): Buffer {
  return Buffer.from(process.env.ADMIN_PASSWORD || "alyancaddy-dev-password");
}

export function signToken(): string {
  const payload = "admin";
  const mac = createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  return `${mac}.${Buffer.from(payload).toString("base64url")}`;
}

export function verifyToken(token: string): boolean {
  const [mac = "", payload = ""] = token.split(".");
  if (!mac || !payload) return false;
  const expected = createHmac("sha256", secret())
    .update(Buffer.from(payload, "base64url"))
    .digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return Boolean(token && verifyToken(token));
}

export async function createAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, signToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}