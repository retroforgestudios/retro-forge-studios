// Central place for content that's still pending a final decision.
// Search "TODO(open-item)" to find everything blocking launch.

export const SITE = {
  name: "Retro Forge Studios",
  email: "jgregory@retroforgestudios.com",
  schedulerUrl: "https://meetings-na2.hubspot.com/john-gregory",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/how-i-work", label: "How I Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// TODO(open-item): confirm final hero headline (Option A vs B)
export const HERO_HEADLINE = "Marketing that hits different.";
export const HERO_HEADLINE_ALT = "Built for Nebraska & Iowa business owners who need to be seen.";

export const STATS = [
  {
    value: "46%",
    label: "of all Google searches have local intent",
    sourceLabel: "Think with Google, 2026",
    sourceUrl: "https://biziq.com/blog/local-seo-statistics-2026/",
  },
  {
    value: "97%",
    label: "of consumers read reviews before choosing a local business",
    sourceLabel: "BrightLocal, 2026",
    sourceUrl: "https://www.brightlocal.com/resources/local-seo-statistics/",
  },
  {
    value: "98%",
    label: "of small businesses now use at least one AI tool",
    sourceLabel: "AP News, 2026",
    sourceUrl: "https://seoprofy.com/blog/local-seo-statistics/",
  },
];

export const SERVICES = [
  {
    slug: "content-creation",
    name: "Content Creation",
    teaser: "High-quality content that sounds like you, not a robot — built fast with AI, polished by hand.",
    heading: "Content that sounds like you, built at AI speed",
    included: [
      "Website & blog copy",
      "Email & newsletter content",
      "Photography/video direction",
      "Rapid drafts and revisions",
    ],
    who: "Businesses that need a steady stream of content without hiring a full in-house team.",
    outcome: "Your story, told consistently, without it eating your week.",
  },
  {
    slug: "brand-strategy-seo",
    name: "Brand Strategy & SEO",
    teaser: "A brand identity backed by real data, so you stand out in your market instead of blending in.",
    heading: "A brand identity backed by data, not guesswork",
    included: [
      "Brand positioning & messaging",
      "Competitor and market research",
      "On-page SEO & keyword research",
      "Google Business Profile optimization",
    ],
    statCallout:
      "Nearly half of all Google searches now carry local intent — if your business isn't optimized for that, you're invisible to the customers actively looking for you.",
    who: "Businesses that want to stand out locally instead of competing on price.",
    outcome: "Found first, chosen first.",
  },
  {
    slug: "social-media-management",
    name: "Social Media Management",
    teaser: "Consistent posting, smarter timing, and content that actually gets engagement — not just likes.",
    heading: "Social media that builds real engagement, not just impressions",
    included: [
      "Content calendar & scheduling",
      "Platform-specific strategy",
      "Community engagement & response",
      "Trend monitoring, powered by AI",
    ],
    who: "Businesses that know they should be posting more, but don't have the time or the playbook.",
    outcome: "Consistent presence, without you having to think about it daily.",
  },
];

export const PROCESS_STEPS = [
  {
    name: "Discovery call",
    description:
      "We talk through your goals, your current presence, and who you're actually trying to reach. No pitch deck, no pressure.",
  },
  {
    name: "Strategy",
    description:
      "I research your market and competitors, then bring you a plan built for your business specifically — not a template.",
  },
  {
    name: "Execution",
    description:
      "AI accelerates the drafting and iteration; I review, polish, and make sure it actually sounds like you before anything goes out.",
  },
  {
    name: "Reporting",
    description:
      "Regular check-ins in plain language — what worked, what didn't, what's next. No vanity metrics dressed up as wins.",
  },
];

export const PRICING_TIERS = [
  {
    name: "Starter",
    tagline: "for businesses just getting consistent",
    price: "$99/mo",
    featured: false,
    features: ["A few posts a week", "Basic content calendar", "Monthly check-in"],
    cta: "Get started",
  },
  {
    name: "Growth",
    tagline: "fan favorite",
    price: "$199/mo",
    featured: true,
    features: [
      "Daily social presence",
      "Full content strategy",
      "SEO optimization",
      "Bi-weekly reporting",
    ],
    cta: "I'm ready grow today",
  },
  {
    name: "Pro",
    tagline: "for businesses ready to scale",
    price: "$299/mo",
    featured: false,
    features: ["Everything in Growth", "Brand strategy sessions", "Priority turnaround"],
    cta: "Get started",
  },
];

export const PRICING_FAQ = [
  {
    q: "How long is the commitment?",
    a: "Month-to-month. Cancel anytime — no long-term contracts.",
  },
  {
    q: "What's the turnaround time?",
    a: "Varies by project scope. We'll set clear expectations together before any work begins.",
  },
  {
    q: "What's NOT included?",
    a: "Paid ad spend, photography/video production, and website hosting & domain costs are billed or arranged separately. Everything else — strategy, content, management — is part of your package.",
  },
];

// TODO(open-item): social URLs — placeholders below, confirm real handles
export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/" },
  { label: "Facebook", href: "https://facebook.com/" },
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "TikTok", href: "https://tiktok.com/" },
  { label: "X", href: "https://x.com/" },
];

// TODO(open-item): trust-bar tool/platform logos — confirm exact list beyond HubSpot, WordPress
export const TRUST_TOOLS = ["HubSpot", "Claude", "YouTube", "WordPress", "Gemini", "TikTok"];
