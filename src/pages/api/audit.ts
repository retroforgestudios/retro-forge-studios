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
