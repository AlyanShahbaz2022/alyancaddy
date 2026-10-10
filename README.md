# AlyanCaddy — Portfolio

A fast, dark-themed, animated personal portfolio for **Alyan Shahbaz** (brand: **AlyanCaddy**). Built with **Next.js 16 (App Router, TypeScript)**, **Tailwind CSS v3**, **Framer Motion**, **Lucide**, **React Hook Form + Zod**, and **Resend** for email.

All content on the site comes from a **single source of truth**: `data/content.json`. Edit the file directly, or use the password-protected `/admin` dashboard — no code changes needed.

## Features

- Custom smooth-trailing circular cursor (hidden on touch devices)
- Scroll-reveal animations, count-up stats, floating hero badges, marquee ticker, FAQ accordion, animated portfolio filters
- Contact form with Zod validation + success/error toasts (emails sent via Resend)
- `/admin` dashboard to edit every field, add/remove/reorder items, and upload images (Cloudinary)
- Copy-protection on the public site (text selection/copy/right-click blocked)
- Skeleton loading UI during route streaming

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your values
npm run dev
```

Open http://localhost:3000. The admin dashboard is at http://localhost:3000/admin.

## Environment variables

| Variable | Description |
| --- | --- |
| `ADMIN_PASSWORD` | Password for `/admin` (required for login) |
| `RESEND_API_KEY` | Resend API key for the contact form. If unset, the form still works and logs the message instead of emailing. |
| `CONTACT_FROM_EMAIL` | Sender address for contact emails (must be verified in Resend) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account for image uploads from `/admin` |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## Admin dashboard

1. Set `ADMIN_PASSWORD` in `.env` and restart the dev server.
2. Visit `/admin`, enter the password, and edit content grouped by section.
3. Changes save directly to `data/content.json` via `PUT /api/admin/content` and are reflected on the site.
4. Image fields accept a URL, or use the **Upload** button to push to Cloudinary.

- Repeatable items (services, projects, FAQs, stats, socials) can be added, removed, and reordered.
- A Zod schema (`src/types/content.ts`) validates every save, so the site and admin can never drift apart.

## Editing content without the dashboard

Every section lives in `data/content.json`:

- Headlines support red-highlighted words with `**double asterisks**` (e.g. `"WORK SPEAKS **FOR ITSELF**"`).
- Portfolio project cards: set `wide: true` for a full-width card and `isMockup: true` for the phone-mockup layout.

## Deployment (Vercel)

1. Push the repo to GitHub and import it into Vercel.
2. Set the env vars above in the Vercel dashboard.
3. The public site is static/fast; `/admin` and `data/content.json` reads work on Vercel because the file is committed.

### ⚠️ Important: file-system writes on serverless hosts

Vercel's filesystem is **read-only at runtime**, so **saving from `/admin` will not persist** in production. Two options:

- **Keep it local-only editing**: run `next dev` locally, edit `/admin` there, commit the updated `data/content.json`, and deploy — the site always reflects it.
- **Future-proof**: `src/lib/getContent.ts` and `src/lib/saveContent.ts` are the only files that read/write content. Swap their internals to a database (Supabase/Postgres, SQLite via Prisma, or Vercel KV) keeping the same JSON shape, and content editing works everywhere.

## SEO

- Title, description, keywords and site URL are edited in **/admin → Site & SEO** and rendered via `generateMetadata` in `src/app/layout.tsx`.
- Generated routes: `/robots.txt` (blocks `/admin` and `/api/`), `/sitemap.xml`, `/manifest.webmanifest`, and `/opengraph-image` (1200×630 share card built from your name, role and photo).
- JSON-LD structured data (Person, WebSite, ProfessionalService, FAQPage) is built in `src/lib/seo.ts` from the same content.
- Canonical URL resolution: admin Site URL → `NEXT_PUBLIC_SITE_URL` → Vercel production domain → localhost.
- Set `GOOGLE_SITE_VERIFICATION` to verify the site in Google Search Console, then submit `https://<your-domain>/sitemap.xml`.

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # run the production build
npm run lint       # eslint
node scripts/validate-content.mjs   # validate data/content.json against the schema
```