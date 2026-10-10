import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { getContent } from "@/lib/getContent";
import { plainText } from "@/lib/seo";

export const alt = "AlyanCaddy portfolio preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

// Local /public images are inlined as data URIs; remote ones are passed
// through. Only PNG/JPEG are supported by the renderer.
async function photoSource(src: string): Promise<string | null> {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  const ext = path.extname(src).toLowerCase();
  if (!MIME[ext]) return null;
  try {
    const file = await readFile(path.join(process.cwd(), "public", src));
    return `data:${MIME[ext]};base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const content = await getContent();
  const photo = await photoSource(content.hero.image || content.about.image);
  const role = plainText(content.hero.eyebrow);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 6,
              color: "#E63946",
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#E63946" }} />
            {content.site.brandDisplay}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 76,
              fontWeight: 900,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {content.site.name}
          </div>
          {role ? (
            <div
              style={{
                marginTop: 26,
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: 3,
                color: "#a1a1aa",
                textTransform: "uppercase",
              }}
            >
              {role}
            </div>
          ) : null}
          <div style={{ marginTop: 40, width: 120, height: 6, background: "#E63946" }} />
        </div>
        {photo ? (
          <div style={{ display: "flex", width: 440, height: "100%", position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt=""
              width={440}
              height={630}
              style={{ width: 440, height: 630, objectFit: "cover", objectPosition: "top" }}
            />
          </div>
        ) : null}
      </div>
    ),
    size
  );
}
