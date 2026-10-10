Build Phases for "AlyanCaddy"
Phase 0 — Scaffold & Design Foundation

- create-next-app (TypeScript, App Router, Tailwind, src/ dir)
- Tailwind theme: near-black bg (#0a0a0a/#111), accent red #E63946, fonts (Archivo Black/Anton for headlines, Inter/Manrope for body) via next/font
- globals.css: noise overlay, selection color, scrollbar, smooth-scroll
- Root layout.tsx: metadata, cursor mount, section anchor setup
  Phase 1 — Dynamic Content System (built first, per your spec)
- types/content.ts — full typed shape (site, nav, hero, stats, about, services[], projects[], faqs[], cta, contact, footer, socials[])
- data/content.json — seeded with your real content
- lib/getContent.ts (typed loader) + lib/saveContent.ts (fs write, isolated so a DB swap later is trivial)
- lib/adminAuth.ts — password check via ADMIN_PASSWORD env + signed cookie
- api/admin/content route (GET/PUT)
  Phase 2 — Shared UI Primitives
- components/ui: Button, Eyebrow (dot + label), SectionHeading (with faint watermark text), Card, TagPill, Marquee, Reveal (whileInView wrapper), CountUp
- components/common: NoiseOverlay, BackToTop, ScrollProgress
  Phase 3 — Custom Cursor
- useMotionValue + useSpring lerp trail, dot + ring, data-hover scaling to 2.5x, "VIEW"/"OPEN" labels, hidden on (pointer: coarse), mix-blend-difference, z-50
  Phase 4 — Public Sections (each reads from getContent(), zero hardcoded text)
- Navbar (scroll blur, mobile overlay) → Hero (letter animation, floating badges, vertical socials) → Stats (count-up) → About → Services (2x2) → Portfolio (animated filter tabs, gradient headers, app mockup card) → Marquee ticker → FAQ accordion → CTA → Contact (copy-email, reveal-phone, form) → Footer
  Phase 5 — Contact Form + API
- api/contact route, React Hook Form + Zod, toast success/error
  Phase 6 — Admin Dashboard
- /admin/login → /admin editor: grouped section forms, add/remove/reorder repeatable items, image upload to /public/images, save via API → writes content.json, confirmation toast
  Phase 7 — Polish, README, Verification
- Responsive pass (375/768/1024/1440), npm run build + lint, README (run locally, /admin login, Vercel deploy + read-only-FS note)
