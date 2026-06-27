# Retro Forge Studios

Marketing site for Retro Forge Studios — built with [Astro](https://astro.build) + [Tailwind CSS v4](https://tailwindcss.com), deployed as a static site on [Cloudflare Pages](https://pages.cloudflare.com/).

## Project structure

```
src/
├── components/
│   ├── badges/        CrownBadge, VeteranPill, VeteranSeal
│   ├── sections/      ServiceCard, StatsBar, CTABanner
│   ├── ui/            Button, SectionHeader
│   ├── Nav.astro
│   └── Footer.astro
├── data/
│   └── site.ts        all copy/content constants — nav, services, pricing, stats, social links
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro          Home
│   ├── services.astro       Services (Content Creation / Brand Strategy & SEO / Social Media Mgmt)
│   ├── how-i-work.astro     How I Work
│   ├── pricing.astro        Pricing
│   ├── about.astro          About
│   └── contact.astro        Contact / Book a Call
└── styles/
    └── global.css   brand color & font tokens (Tailwind v4 @theme)
```

## Commands

| Command           | Action                                       |
| :----------------- | :-------------------------------------------- |
| `npm install`       | Install dependencies                          |
| `npm run dev`        | Start local dev server at `localhost:4321`    |
| `npm run build`      | Build static site to `./dist/`                |
| `npm run preview`    | Preview the production build locally          |

## Deploying to Cloudflare Pages

1. Push this repo to GitHub/GitLab.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, select this repo.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Add the custom domain (e.g. `retroforgestudios.com`) under the Pages project's **Custom domains** tab once DNS is pointed at Cloudflare.

No environment variables or Pages Functions are required — this is a fully static build.

## Open items before launch

These are tracked inline in the code with `TODO(open-item)` comments — search the repo for that string to find every blocking spot. As of this writing:

- [x] **Hero headline** — confirmed, keeping "Marketing that hits different." Removed the unused Option B alt copy from [`src/data/site.ts`](src/data/site.ts).
- [x] **Pricing** — done. Starter $99/mo, Growth $199/mo, Pro $299/mo, set in [`src/data/site.ts`](src/data/site.ts).
- [x] **How I Work → communication style** — done. Real copy in [`src/pages/how-i-work.astro`](src/pages/how-i-work.astro): email for everything important, plus a shared doc/calendar for ongoing projects.
- [x] **About page photo** — done. Real circular headshot in [`src/pages/about.astro`](src/pages/about.astro), saved at [`public/images/johnny-headshot.png`](public/images/johnny-headshot.png).
- [x] **Social URLs** — done. Real LinkedIn, Facebook, Instagram, TikTok, and X handles set in [`src/data/site.ts`](src/data/site.ts) (`SOCIAL_LINKS`).
- [x] **Trust-bar tool logos** — done. `TRUST_TOOLS` lists HubSpot, Claude, YouTube, WordPress, Gemini, TikTok, rendered via [`src/components/ui/ToolIcon.astro`](src/components/ui/ToolIcon.astro) using the real logo files supplied, saved in `public/images/brands/`. Confirm this is the final list of tools to feature.
- [x] **Veteran-owned seal artwork** — done. Refined original SVG seal in [`src/components/badges/VeteranSeal.astro`](src/components/badges/VeteranSeal.astro): star + checkmark shield + flanking laurel wreath + "EST. 2008" ribbon, ringed by "VETERAN OWNED BUSINESS • NEBRASKA & IOWA". Built in-house (no third-party/official seal artwork), so it's safe to use commercially; swap if a branded version is ever supplied.
- [x] **Logo files** — done. Horizontal wordmark used in nav/footer ([`public/images/logo-wordmark.png`](public/images/logo-wordmark.png)), and the rF icon mark is now the favicon/apple-touch-icon (generated at 16x16, 32x32, 180x180 from [`public/images/icon-mark.png`](public/images/icon-mark.png)). The icon mark's full-res file is also available in `public/images/` if you want to use it for social avatars.
- [x] **Contact scheduler embed** — done. Switched from a plain `<iframe>` to HubSpot's native auto-resizing meetings JS widget in [`src/pages/contact.astro`](src/pages/contact.astro); fixes the internal scrollbar the plain iframe had.
- [x] **SEO basics** — done. Added `robots.txt`, an auto-generated sitemap (`@astrojs/sitemap`, site URL set to `https://retroforgestudios.com` in `astro.config.mjs`), canonical links, and Open Graph/Twitter Card meta tags in [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro). Still no GA/Search Console tags — analytics setup is a separate step.
- [x] **404 page** — done. Branded not-found page at [`src/pages/404.astro`](src/pages/404.astro).
- [x] **Privacy policy** — done. Basic privacy policy page at [`src/pages/privacy.astro`](src/pages/privacy.astro), linked in the footer copyright bar.
- [x] **Background treatment** — done, revised twice. The whole site body is now `#f2f2f2` (light) — nav, footer, and the hero photo+scrim sections (on every page) are the only parts that stay dark charcoal. This is a deviation from the brief's "primary background: charcoal everywhere" spec; flag if you'd rather revert to dark.

Phone number is intentionally omitted site-wide — confirmed: email + scheduler only.

## ⚠️ Domain not yet pointed at this site

As of this writing, `www.retroforgestudios.com` is live with a **different, separate HubSpot CMS-built site** (not this project). This Astro/Cloudflare Pages project currently only exists at its Cloudflare Pages preview URL — the custom domain has never been connected to it. Confirm whether that HubSpot site should be replaced before going live, and update DNS/custom domain settings in the Cloudflare Pages dashboard accordingly.
