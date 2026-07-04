// Free website-audit tool (see /website-audit). Fetches the submitted URL
// server-side and runs a handful of real, verifiable on-page checks — no
// fabricated scores. Returns JSON consumed by the page's client-side script.
export const prerender = false;

import type { APIRoute } from "astro";

interface Check {
  key: string;
  label: string;
  pass: boolean;
  detail: string;
}

const BLOCKED_HOSTS = new Set(["localhost", "0.0.0.0", "::1"]);

function isBlockedHost(hostname: string) {
  if (BLOCKED_HOSTS.has(hostname)) return true;
  if (hostname === "127.0.0.1" || hostname.startsWith("127.")) return true;
  if (hostname.startsWith("10.") || hostname.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) return true;
  return false;
}

function normalizeUrl(input: string): URL {
  const trimmed = input.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return new URL(withProtocol);
}

async function fetchWithTimeout(url: string, ms: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal, headers: { "User-Agent": "RetroForgeStudios-Audit/1.0" } });
  } finally {
    clearTimeout(timeout);
  }
}

export const POST: APIRoute = async ({ request }) => {
  let target: URL;
  try {
    const body = await request.json();
    target = normalizeUrl(String(body.url ?? ""));
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Please enter a valid website address." }), { status: 400 });
  }

  if (target.protocol !== "https:" && target.protocol !== "http:") {
    return new Response(JSON.stringify({ ok: false, error: "Please enter a valid website address." }), { status: 400 });
  }
  if (isBlockedHost(target.hostname)) {
    return new Response(JSON.stringify({ ok: false, error: "That address can't be audited." }), { status: 400 });
  }

  const checks: Check[] = [];
  let html = "";
  let loadTimeMs = 0;
  let contentEncoding = "";

  try {
    const start = Date.now();
    const res = await fetchWithTimeout(target.href, 8000);
    loadTimeMs = Date.now() - start;

    if (!res.ok) {
      return new Response(
        JSON.stringify({ ok: false, error: `That site returned an error (HTTP ${res.status}). Double-check the address.` }),
        { status: 400 },
      );
    }
    contentEncoding = res.headers.get("content-encoding") ?? "";
    html = await res.text();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Couldn't reach that site. Double-check the address and try again." }),
      { status: 400 },
    );
  }

  const head = html.slice(0, 300_000);

  checks.push({
    key: "https",
    label: "HTTPS enabled",
    pass: target.protocol === "https:",
    detail:
      target.protocol === "https:"
        ? "Your site loads securely over HTTPS."
        : "Your site isn't served over HTTPS — browsers flag this as \"Not Secure.\"",
  });

  checks.push({
    key: "speed",
    label: "Fast server response",
    pass: loadTimeMs < 1500,
    detail:
      loadTimeMs < 1500
        ? `Responded in ${loadTimeMs}ms — a good, snappy response time.`
        : `Took ${loadTimeMs}ms to respond — visitors (and Google) notice sluggish load times.`,
  });

  const titleMatch = head.match(/<title[^>]*>([^<]*)<\/title>/i);
  const titleText = titleMatch?.[1]?.trim() ?? "";
  checks.push({
    key: "title",
    label: "Title tag",
    pass: titleText.length >= 10 && titleText.length <= 65,
    detail: titleText
      ? `Found: "${titleText.slice(0, 70)}" (${titleText.length} characters).`
      : "No <title> tag found — this is one of the biggest on-page SEO signals you're missing.",
  });

  const descMatch = head.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const descText = descMatch?.[1]?.trim() ?? "";
  checks.push({
    key: "description",
    label: "Meta description",
    pass: descText.length >= 50 && descText.length <= 160,
    detail: descText
      ? `Found (${descText.length} characters) — ${descText.length > 160 ? "a bit long, Google may truncate it." : "good length."}`
      : "No meta description found — Google will write its own snippet instead of yours.",
  });

  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(head);
  checks.push({
    key: "mobile",
    label: "Mobile-friendly setup",
    pass: hasViewport,
    detail: hasViewport
      ? "A mobile viewport tag is set up correctly."
      : "No mobile viewport tag found — the site likely won't render properly on phones.",
  });

  const robotsMetaMatch = head.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i);
  const isNoindex = /noindex/i.test(robotsMetaMatch?.[1] ?? "");
  checks.push({
    key: "indexable",
    label: "Not blocked from Google",
    pass: !isNoindex,
    detail: isNoindex
      ? "This page has a \"noindex\" tag — it's telling Google not to show it in search results at all."
      : "No noindex tag found — the page is free to appear in search results.",
  });

  const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(head);
  checks.push({
    key: "canonical",
    label: "Canonical tag",
    pass: hasCanonical,
    detail: hasCanonical
      ? "A canonical tag is set — helps avoid duplicate-content confusion."
      : "No canonical tag found — worth adding to prevent duplicate-content issues (e.g. www vs non-www).",
  });

  const h1Count = (head.match(/<h1[\s>]/gi) ?? []).length;
  checks.push({
    key: "h1",
    label: "Single H1 heading",
    pass: h1Count === 1,
    detail:
      h1Count === 1
        ? "Exactly one <h1> found — clear page structure for search engines."
        : h1Count === 0
          ? "No <h1> found — the page is missing its main heading."
          : `${h1Count} <h1> tags found — having more than one can confuse search engines about the page's main topic.`,
  });

  const imgTags = head.match(/<img\b[^>]*>/gi) ?? [];
  const imgWithAlt = imgTags.filter((tag) => /alt=["'][^"']+["']/i.test(tag)).length;
  const altPass = imgTags.length === 0 || imgWithAlt / imgTags.length >= 0.9;
  checks.push({
    key: "alt-text",
    label: "Image alt text",
    pass: altPass,
    detail:
      imgTags.length === 0
        ? "No images found on the page."
        : `${imgWithAlt} of ${imgTags.length} images have alt text (${Math.round((imgWithAlt / imgTags.length) * 100)}%) — alt text helps accessibility and image search.`,
  });

  const hasLang = /<html[^>]+lang=["'][a-zA-Z-]+["']/i.test(head);
  checks.push({
    key: "lang",
    label: "Page language declared",
    pass: hasLang,
    detail: hasLang
      ? "The page declares its language — helps screen readers and search engines."
      : "No lang attribute on the <html> tag — an easy accessibility fix.",
  });

  let hasFavicon = /<link[^>]+rel=["'](?:shortcut )?icon["']/i.test(head);
  if (!hasFavicon) {
    try {
      const faviconRes = await fetchWithTimeout(new URL("/favicon.ico", target).href, 4000);
      hasFavicon = faviconRes.ok;
    } catch {
      // Leave as false — a failed favicon fetch just means it's missing.
    }
  }
  checks.push({
    key: "favicon",
    label: "Favicon present",
    pass: hasFavicon,
    detail: hasFavicon
      ? "A favicon is set — a small but real polish signal for browser tabs and bookmarks."
      : "No favicon found — browser tabs show a blank/default icon instead of your brand.",
  });

  const isCompressed = /\b(gzip|br|deflate)\b/i.test(contentEncoding);
  checks.push({
    key: "compression",
    label: "Compression enabled",
    pass: isCompressed,
    detail: isCompressed
      ? `Responses are compressed (${contentEncoding}) — faster downloads for visitors.`
      : "No compression detected on the response — pages are being sent larger than they need to be.",
  });

  const hasMixedContent = target.protocol === "https:" && /(?:src|href)=["']http:\/\//i.test(head);
  checks.push({
    key: "mixed-content",
    label: "No mixed content",
    pass: !hasMixedContent,
    detail: hasMixedContent
      ? "This HTTPS page loads at least one resource over plain HTTP — browsers may block it or show a security warning."
      : "No mixed content detected — all resources load securely.",
  });

  const hasStructuredData = /<script[^>]+type=["']application\/ld\+json["']/i.test(head);
  checks.push({
    key: "schema",
    label: "Structured data",
    pass: hasStructuredData,
    detail: hasStructuredData
      ? "Structured data (schema.org) found — helps Google understand your business."
      : "No structured data found — a missed opportunity for richer search results.",
  });

  const hasOg = /<meta[^>]+property=["']og:title["']/i.test(head) && /<meta[^>]+property=["']og:image["']/i.test(head);
  checks.push({
    key: "social",
    label: "Social share tags",
    pass: hasOg,
    detail: hasOg
      ? "Open Graph tags are set up — links will look good when shared on social media."
      : "Missing Open Graph tags — shared links on Facebook/LinkedIn will look plain or broken.",
  });

  let robotsOk = false;
  let sitemapOk = false;
  try {
    const robotsRes = await fetchWithTimeout(new URL("/robots.txt", target).href, 5000);
    if (robotsRes.ok) {
      robotsOk = true;
      const robotsText = await robotsRes.text();
      sitemapOk = /sitemap:/i.test(robotsText);
    }
  } catch {
    // Treated as a failed check below — not a fatal error for the whole audit.
  }

  checks.push({
    key: "robots",
    label: "robots.txt present",
    pass: robotsOk,
    detail: robotsOk ? "robots.txt found and reachable." : "No robots.txt found at the site root.",
  });

  checks.push({
    key: "sitemap",
    label: "Sitemap referenced",
    pass: sitemapOk,
    detail: sitemapOk
      ? "A sitemap is referenced in robots.txt — helps search engines find all your pages."
      : "No sitemap reference found — search engines may miss pages on the site.",
  });

  const passCount = checks.filter((c) => c.pass).length;
  const score = Math.round((passCount / checks.length) * 100);
  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";

  return new Response(
    JSON.stringify({ ok: true, url: target.href, checks, score, grade, loadTimeMs }),
    { headers: { "Content-Type": "application/json" } },
  );
};
