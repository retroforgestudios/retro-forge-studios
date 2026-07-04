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
      if (
        parsed &&
        Array.isArray(parsed.bios) &&
        parsed.bios.every((b: unknown) => {
          const bio = b as Record<string, unknown>;
          return bio && typeof bio.platform === "string" && typeof bio.text === "string";
        }) &&
        Array.isArray(parsed.captions) &&
        parsed.captions.every((c: unknown) => typeof c === "string")
      ) {
        return {
          bios: parsed.bios.map((b: { platform: string; text: string }) => ({
            platform: b.platform.trim(),
            text: b.text.trim(),
          })),
          captions: parsed.captions.map((c: string) => c.trim()).filter(Boolean),
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

  return extractJsonObject(text);
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
