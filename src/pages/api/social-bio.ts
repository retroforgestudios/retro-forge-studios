// Free "Social Bio & Caption Generator" tool (see /social-bio-generator).
// Runs entirely on Cloudflare Workers AI — no external API key.
export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

const MODEL = "@cf/meta/llama-3.2-3b-instruct";

interface BioResult {
  bios: { platform: string; text: string }[];
  captions: string[];
}

const PLATFORM_LIMITS = [
  { platform: "Instagram", limit: 150 },
  { platform: "X (Twitter)", limit: 160 },
  { platform: "Facebook", limit: 200 },
  { platform: "LinkedIn", limit: 120 },
];

const SYSTEM_PROMPT = `You write social media bios and captions for a small local business. You must:
- Write one bio per platform: Instagram (max 150 characters), X/Twitter (max 160 characters), Facebook (max 200 characters), LinkedIn (max 120 characters, more professional in tone than the others)
- Each bio should sound like a real business, not corporate marketing-speak — warm, specific, a little personality where the platform allows it (Instagram/Facebook can be more casual, LinkedIn more professional)
- Include what the business does and, if given, the city — naturally, not stuffed
- Also write 5 short caption starters/hooks a business could adapt for real posts (things like a question, a behind-the-scenes opener, a customer-focused line) — NOT generic ("Check out our...")

Respond with ONLY a JSON object in this exact shape, nothing else — no markdown, no commentary before or after:
{"bios": [{"platform": "Instagram", "text": "..."}, {"platform": "X (Twitter)", "text": "..."}, {"platform": "Facebook", "text": "..."}, {"platform": "LinkedIn", "text": "..."}], "captions": ["...", "...", "...", "...", "..."]}`;

function extractJsonObject(text: string): BioResult | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  // The model occasionally emits a stray unescaped quote/apostrophe that
  // breaks strict JSON.parse. Try as-is first, then with smart quotes
  // normalized to straight quotes.
  for (const candidate of [match[0], match[0].replace(/[‘’]/g, "'").replace(/[“”]/g, '"')]) {
    try {
      const parsed = JSON.parse(candidate);
      if (!parsed || !Array.isArray(parsed.bios)) continue;

      // The model sometimes nests the captions list as a stray extra item
      // inside the bios array (e.g. {"captions": [...]}) instead of as a
      // top-level sibling key. Pull real {platform, text} bios out, and
      // recover captions from either the correct top-level key or that
      // misplaced entry.
      let captions: unknown = Array.isArray(parsed.captions) ? parsed.captions : null;
      const bios: { platform: string; text: string }[] = [];
      for (const item of parsed.bios) {
        const entry = item as Record<string, unknown>;
        if (entry && typeof entry.platform === "string" && typeof entry.text === "string") {
          bios.push({ platform: entry.platform.trim(), text: entry.text.trim() });
        } else if (!captions && entry && Array.isArray(entry.captions)) {
          captions = entry.captions;
        }
      }

      if (
        bios.length > 0 &&
        Array.isArray(captions) &&
        captions.every((c: unknown) => typeof c === "string")
      ) {
        return {
          bios,
          captions: (captions as string[]).map((c) => c.trim()).filter(Boolean),
        };
      }
    } catch {
      // try next candidate / fall through
    }
  }
  return null;
}

async function generateBios(userPrompt: string): Promise<BioResult | null> {
  const result = (await env.AI.run(MODEL, {
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    // Default max_tokens is only 256 — too small for 4 bios + 5 captions in
    // JSON. Output was silently truncating mid-generation, producing
    // syntactically incomplete JSON no parsing fix could repair.
    max_tokens: 1024,
  })) as {
    response?: unknown;
    choices?: { message?: { content?: unknown } }[];
  };

  // This model returns an OpenAI-compatible chat-completion shape
  // (choices[0].message.content), not the simpler { response } shape
  // some other Workers AI models use — handle both.
  const text =
    typeof result.response === "string"
      ? result.response
      : typeof result.choices?.[0]?.message?.content === "string"
        ? (result.choices[0].message.content as string)
        : "";

  const parsed = extractJsonObject(text);
  if (!parsed) {
    console.log("Social bio parse failed. Text length:", text.length, "Raw:", text.slice(0, 1200));
  }
  return parsed;
}

export const POST: APIRoute = async ({ request }) => {
  let business = "";
  let service = "";
  let city = "";
  try {
    const body = await request.json();
    business = String(body.business ?? "").trim().slice(0, 80);
    service = String(body.service ?? "").trim().slice(0, 80);
    city = String(body.city ?? "").trim().slice(0, 80);
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Something went wrong. Please try again." }), { status: 400 });
  }

  if (!service) {
    return new Response(
      JSON.stringify({ ok: false, error: "Tell us what your business does to get a tailored bio." }),
      { status: 400 },
    );
  }

  const details = [
    business && `Business name: ${business}`,
    `What they do: ${service}`,
    city && `City: ${city}`,
  ]
    .filter(Boolean)
    .join("\n");

  const userPrompt = `${details}\n\nGive me bios for Instagram, X (Twitter), Facebook, and LinkedIn, plus 5 caption starters.`;

  try {
    // A generation occasionally comes back malformed — that's
    // non-deterministic, so a fresh attempt usually succeeds even when the
    // first one didn't. Retry once before failing.
    let result = await generateBios(userPrompt);
    if (!result) {
      result = await generateBios(userPrompt);
    }

    if (!result) {
      return new Response(
        JSON.stringify({ ok: false, error: "Couldn't generate a bio that time — please try again." }),
        { status: 502 },
      );
    }

    // Fold in the character limit for each bio so the page can show a
    // live "X of Y characters" check without duplicating the list client-side.
    const bios = result.bios.map((bio) => {
      const match = PLATFORM_LIMITS.find((p) => p.platform === bio.platform);
      return { ...bio, limit: match?.limit ?? 160 };
    });

    return new Response(JSON.stringify({ ok: true, bios, captions: result.captions.slice(0, 5) }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Social bio generation failed:", error);
    return new Response(
      JSON.stringify({ ok: false, error: "Couldn't generate a bio right now — please try again in a moment." }),
      { status: 502 },
    );
  }
};
