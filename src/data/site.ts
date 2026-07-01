// Central place for content that's still pending a final decision.
// Search "TODO(open-item)" to find everything blocking launch.

export const SITE = {
  name: "Retro Forge Studios",
  email: "jgregory@retroforgestudios.com",
  schedulerUrl: "https://meetings.hubspot.com/retroforgestudios",
  // One-sentence description used for SEO metadata and structured data.
  description:
    "AI-enhanced content, brand strategy & SEO, and social media management for Nebraska & Iowa small businesses.",
};

// Analytics & search-console. Fill these in and they wire up automatically.
export const ANALYTICS = {
  // Google Analytics 4 Measurement ID — looks like "G-XXXXXXXXXX".
  // GA4 → Admin → Data streams → your stream → Measurement ID.
  // Leave "" to disable analytics entirely.
  googleTagId: "",
  // Google Search Console "HTML tag" verification code (just the content value,
  // e.g. "abc123..."). Leave "" if you verify via DNS or your GA connection.
  googleSiteVerification: "",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/how-i-work", label: "How I Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Featured CTA card on the right side of the Services mega-menu in the nav.
export const MENU_FEATURE = {
  eyebrow: "Not sure where to start?",
  title: "Book a free call",
  text: "No pressure, no jargon — let's figure out the right mix for your business.",
  image: "/images/menu/book-call.svg",
  ctaLabel: "Book a free call",
  href: "/contact",
};

export const HERO_HEADLINE = "Marketing that hits different.";

export const STATS = [
  {
    value: "46%",
    label: "of all Google searches have local intent",
    sourceLabel: "Think with Google, 2026",
    sourceUrl: "https://www.thinkwithgoogle.com/consumer-insights/consumer-trends/local-search-statistics/",
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
    sourceUrl: "https://apnews.com/article/small-business-artificial-intelligence-productivity-f6fa7b2a1ce0a9f2e5b8b48670b3098a",
  },
];

export const SERVICES = [
  {
    slug: "content-creation",
    name: "Content Creation",
    icon: "M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9 12h6M9 16h6",
    teaser: "High-quality content that sounds like you, not a robot — built fast with AI, polished by hand.",
    heading: "Content that sounds like you, built at AI speed",
    intro: [
      "Most small business owners know they should be putting out more content — blog posts, emails, social captions, the works. But between actually running the business and the blank-page paralysis of writing, it never happens. So the website goes stale, the newsletter never ships, and the story you want to tell stays stuck in your head.",
      "That's the gap I fill. I create a steady stream of high-quality content that genuinely sounds like you — not generic, robotic filler. AI handles the heavy lifting on drafting and research so things move in days instead of weeks, and I handle the polishing, the strategy, and the part that makes it sound human.",
      "The result is content you're actually proud to put your name on, produced fast enough to keep up with your business.",
    ],
    included: [
      { title: "Website & landing page copy", description: "Clear, persuasive copy for your homepage, service pages, and landing pages that turns visitors into customers." },
      { title: "Blog posts & articles", description: "SEO-aware articles answering the questions your customers are actually Googling — positioning you as the local expert." },
      { title: "Email & newsletter content", description: "Regular emails that keep you top of mind, written in a voice your subscribers actually want to open." },
      { title: "Photography & video direction", description: "Guidance on what to shoot and how, so your visuals match the quality of your words." },
      { title: "Rapid drafts & revisions", description: "Fast turnaround on new content and changes — no waiting weeks for a single blog post." },
    ],
    whoFor: [
      "You know content matters but never have the time to actually create it",
      "Your website or blog has gone stale and needs fresh, consistent updates",
      "You want content that sounds like a real person, not AI sludge",
      "You'd rather hand it off than hire and manage a full-time writer",
    ],
    steps: [
      { name: "Voice & goals", description: "We nail down how you talk and what you're trying to achieve, so everything sounds like you from day one." },
      { name: "Content plan", description: "I map out what to publish and when — topics, formats, and a realistic cadence you can actually sustain." },
      { name: "Draft at AI speed", description: "AI accelerates the drafting and research, so you get content in days, not weeks." },
      { name: "Human polish", description: "I review, edit, and shape every piece so it's accurate, on-brand, and genuinely good before it goes out." },
    ],
    statCallout:
      "Businesses that publish consistent, quality content earn far more traffic and leads than those that don't — but only if it's good enough to actually read.",
    outcome: "Your story, told consistently — without it eating your week.",
    faqs: [
      { q: "Will it sound like AI wrote it?", a: "No. AI helps me draft fast, but every piece is edited and shaped by a real person to sound like you. That human polish is the entire point." },
      { q: "How much content can you produce?", a: "It depends on your goals — we'll set a realistic, consistent cadence together rather than promising a firehose you don't actually need." },
      { q: "Do I have to come up with the ideas?", a: "Only if you want to. I'll bring a content plan and topic ideas based on your business and what your customers are searching for." },
    ],
  },
  {
    slug: "brand-strategy-seo",
    name: "Brand Strategy & SEO",
    icon: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 20l-4.35-4.35",
    teaser: "A brand identity backed by real data, so you stand out in your market instead of blending in.",
    heading: "A brand identity backed by data, not guesswork",
    intro: [
      "A lot of small businesses pick a couple of colors, slap a logo together, and call that their 'brand.' Then they wonder why they blend in with every competitor — and why nobody can find them on Google. A real brand is a strategy, not just a look. And getting found is a science, not luck.",
      "I build a brand identity grounded in actual research: who your customers are, what your competitors are doing, and the exact words people use when they search for what you offer. Then I make sure your business actually shows up when those people go looking.",
      "You end up with a brand that stands out for the right reasons and a presence that gets found first.",
    ],
    included: [
      { title: "Brand positioning & messaging", description: "Clear answers to who you are, who you serve, and why you're the obvious choice — in language that actually lands." },
      { title: "Competitor & market research", description: "A real look at what competitors do well (and badly) so you can carve out a position that's genuinely yours." },
      { title: "On-page SEO & keyword research", description: "Finding the exact terms your customers search, and optimizing your site so Google connects them to you." },
      { title: "Google Business Profile optimization", description: "Dialing in the free listing that decides whether you appear in the local map results — the highest-ROI fix most businesses ignore." },
    ],
    whoFor: [
      "You blend in with competitors and want to genuinely stand out",
      "You're invisible when people search for what you do locally",
      "Your branding was thrown together and never had a strategy behind it",
      "You'd rather compete on value than race to the bottom on price",
    ],
    steps: [
      { name: "Research", description: "I dig into your market, your competitors, and how customers actually search — the data your strategy will stand on." },
      { name: "Positioning", description: "We define exactly where you fit, what makes you different, and the message that makes you the obvious choice." },
      { name: "Optimize", description: "I apply that to your site and listings — keywords, on-page SEO, and your Google Business Profile." },
      { name: "Refine", description: "We track what's working and keep sharpening, because search and competition never sit still." },
    ],
    statCallout:
      "Nearly half of all Google searches now carry local intent — if your business isn't optimized for that, you're invisible to the customers actively looking for you.",
    outcome: "Found first, chosen first.",
    faqs: [
      { q: "How long until I see SEO results?", a: "SEO is a build, not a switch. Some fixes (like your Google Business Profile) help quickly; ranking gains typically build over a few months. I'll set honest expectations up front." },
      { q: "Do I need a full rebrand?", a: "Not necessarily. Often it's sharpening your message and positioning, not redoing your logo. We start with what'll move the needle most." },
      { q: "Can you guarantee a #1 ranking?", a: "Nobody legitimately can — and anyone who promises it isn't being straight with you. What I can do is apply proven, white-hat strategies that steadily improve where you show up." },
    ],
  },
  {
    slug: "social-media-management",
    name: "Social Media Management",
    icon: "M18 8a3 3 0 1 0-2.83-4H15a3 3 0 1 0 0 6 2.97 2.97 0 0 0 1.74-.56l-5.49 3.2a3 3 0 1 0 0 2.72l5.49 3.2A2.97 2.97 0 0 0 15 17a3 3 0 1 0 2.83-4",
    teaser: "Consistent posting, smarter timing, and content that actually gets engagement — not just likes.",
    heading: "Social media that builds real engagement, not just impressions",
    intro: [
      "Posting to social media is one of those things every business owner knows they 'should' do more of — and almost nobody keeps up with. You post in a burst, go quiet for a month, and that silence quietly tells potential customers you might not even be open anymore.",
      "I take it off your plate entirely. A consistent posting rhythm, content tailored to each platform, real engagement with your audience, and AI-powered trend monitoring so you're riding what's working instead of chasing it three weeks late.",
      "It's a steady, professional presence that builds trust and brings in customers — without you having to think about it every day.",
    ],
    included: [
      { title: "Content calendar & scheduling", description: "A planned, consistent posting rhythm so your feed never goes silent — scheduled in advance and off your plate." },
      { title: "Platform-specific strategy", description: "Content shaped for where it's posted, because what works on Instagram isn't what works on Facebook or LinkedIn." },
      { title: "Community engagement", description: "Responding to comments, messages, and reviews so your audience feels heard — and so you don't miss leads hiding in your DMs." },
      { title: "AI-powered trend monitoring", description: "Catching what's working in your space early, so your content stays current instead of dated." },
    ],
    whoFor: [
      "You know you should post more but never find the time",
      "Your accounts go quiet for weeks at a stretch",
      "You're chasing likes but not actually getting customers from it",
      "You want a consistent presence without the daily mental load",
    ],
    steps: [
      { name: "Strategy", description: "We pick the right platforms and define what we'll post and why — built around your customers, not vanity metrics." },
      { name: "Create & schedule", description: "I batch and schedule content in advance so your presence stays consistent without daily scrambling." },
      { name: "Engage", description: "I monitor and respond to comments, messages, and reviews so your community stays warm." },
      { name: "Report", description: "Regular, plain-language updates on what's working and what's next — no dashboards full of vanity numbers." },
    ],
    statCallout:
      "Consistency beats going viral. A steady, current presence builds the trust that actually turns followers into paying customers.",
    outcome: "Consistent presence, without you having to think about it daily.",
    faqs: [
      { q: "Which platforms should I be on?", a: "Only the ones where your customers actually are. I'd rather run one or two platforms well than spread you thin across five." },
      { q: "Do you create the content or just post it?", a: "Both — I plan, create, and schedule the content, then handle engagement. You can be as hands-on or hands-off as you like." },
      { q: "Will you respond to comments and messages?", a: "Yes. Community engagement is part of it — responding to comments, DMs, and reviews so nothing (and no lead) slips through the cracks." },
    ],
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
    tagline: "best value",
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

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/retro-forge-studios/" },
  { label: "Facebook", href: "https://www.facebook.com/RetroForgeStudios" },
  { label: "Instagram", href: "https://www.instagram.com/retroforgestudios/" },
  { label: "TikTok", href: "https://www.tiktok.com/@retroforgestudios" },
  { label: "X", href: "https://x.com/RetroForgeStud" },
];

export const TRUST_TOOLS = ["HubSpot", "Claude", "YouTube", "WordPress", "Gemini", "TikTok"];
