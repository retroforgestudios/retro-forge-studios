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

- [ ] **Hero headline** — confirm Option A ("Marketing that hits different.") vs Option B. Set in [`src/data/site.ts`](src/data/site.ts).
- [ ] **Pricing** — Starter/Growth/Pro are all `$XXX` placeholders in [`src/data/site.ts`](src/data/site.ts).
- [ ] **How I Work → communication style** — placeholder text in [`src/pages/how-i-work.astro`](src/pages/how-i-work.astro).
- [ ] **About page photo** — replace the placeholder circle in [`src/pages/about.astro`](src/pages/about.astro) with a real photo.
- [ ] **Social URLs** — placeholder links in [`src/data/site.ts`](src/data/site.ts) (`SOCIAL_LINKS`), confirm real handles.
- [ ] **Trust-bar tool logos** — confirm full list beyond HubSpot/WordPress in `TRUST_TOOLS`.
- [ ] **Veteran-owned seal artwork** — currently a built-from-spec SVG placeholder in [`src/components/badges/VeteranSeal.astro`](src/components/badges/VeteranSeal.astro); swap for real logo-team artwork if supplied.
- [ ] **Logo files** — nav/footer currently render the wordmark as styled text; swap for real SVG wordmark/icon mark once available.
- [ ] **Contact scheduler embed** — currently a plain `<iframe>` of the HubSpot meetings link in [`src/pages/contact.astro`](src/pages/contact.astro); confirm if you'd rather use HubSpot's native JS meetings widget.
- [ ] **Analytics/SEO** — no GA/Search Console tags, sitemap, or per-page meta descriptions beyond what's in each page's `description` prop yet.
- [ ] **Background treatment** — add contrasting/textured background color to break up the flat charcoal background, similar to the effect on [retroforgestudios.com](https://www.retroforgestudios.com/). Needs a follow-up look at that site's actual styling to pin down the exact treatment (gradient vs. section color-blocking vs. texture) before implementing.

Phone number is intentionally omitted site-wide — confirmed: email + scheduler only.
