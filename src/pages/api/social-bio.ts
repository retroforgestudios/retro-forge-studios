// Free "Social Bio & Caption Generator" tool (see /social-bio-generator).
// Runs entirely on Cloudflare Workers AI — no external API key.
export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

const MODEL = "@cf/meta/llama-3.2-3b-instruct";

interface Bio {
  platform: string;
  text: string;
}

const PLATFORM_LIMITS = [
  { platform: "Instagram", limit: 150 },
  { platform: "X (Twitter)", limit: 160 },
  { platform: "Facebook", limit: 200 },
  { platform: "LinkedIn", limit: 120 },
];

// Split into two separate, simpler generations instead of one combined
// {bios: [...], captions: [...]} object. That combined shape (array-of-
// objects with a sibling array-of-strings) consistently tripped up this
// small model — it kept emitting subtly different unbalanced-bracket
// variants (missing closes, misplaced closes) that no single regex repair
// could reliably catch. Each call below reuses a schema already proven
// reliable elsewhere in this codebase: array-of-objects (meta-tags.ts) and
// array-of-strings (blog-ideas.ts).
const BIOS_SYSTEM_PROMPT = `You write social media bios for a small local business. You must:
- Write one bio per platform: Instagram (max 150 characters), X/Twitter (max 160 characters), Facebook (max 200 characters), LinkedIn (max 120 characters, more professional in tone than the others)
- Each bio should sound like a real business, not corporate marketing-speak — warm, specific, a little personality where the platform allows it (Instagram/Facebook can be more casual, LinkedIn more professional)
- Include what the business does and, if given, the city — naturally, not stuffed

Respond with ONLY a JSON array of exactly 4 objects, nothing else — no markdown, no commentary before or after. Example format:
[{"platform": "Instagram", "text": "..."}, {"platform": "X (Twitter)", "text": "..."}, {"platform": "Facebook", "text": "..."}, {"platform": "LinkedIn", "text": "..."}]`;

const CAPTIONS_SYSTEM_PROMPT = `You write social media caption starters/hooks for a small local business — things a business could adapt for real posts (a question, a behind-the-scenes opener, a customer-focused line). Avoid generic lines like "Check out our...".

Respond with ONLY a JSON array of exactly 5 strings, nothing else — no markdown, no numbering, no commentary before or after. Example format:
["Caption one", "Caption two"]`;

function extractJsonArray<T>(text: string, validate: (item: unknown) => item is T): T[] | null {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;
  for (const candidate of [match[0], match[0].replace(/[‘’]/g, "'").replace(/[“”]/g, '"')]) {
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed) && parsed.every(validate)) {
        return parsed;
      }
    } catch {
      // try next candidate / fall through
    }
  }
  return null;
}

function isBio(item: unknown): item is Bio {
  const b = item as Record<string, unknown>;
  return !!b && typeof b.platform === "string" && typeof b.text === "string";
}

// Fallback if the model doesn't return clean JSON for captions: pull one
// per line, stripping common list markers.
function extractLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[\s"'\-*\d.)]+/, "").replace(/["']+$/, "").trim())
    .filter((line) => line.length > 5 && line.length < 200)
    .slice(0, 5);
}

async function runChat(systemPrompt: string, userPrompt: string, maxTokens: number): Promise<string> {
  const result = (await env.AI.run(MODEL, {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: maxTokens,
  })) as {
    response?: unknown;
    choices?: { message?: { content?: unknown } }[];
  };

  // This model returns an OpenAI-compatible chat-completion shape
  // (choices[0].message.content), not the simpler { response } shape
  // some other Workers AI models use — handle both.
  return typeof result.response === "string"
    ? result.response
    : typeof result.choices?.[0]?.message?.content === "string"
      ? (result.choices[0].message.content as string)
      : "";
}

async function generateBios(userPrompt: string): Promise<Bio[] | null> {
  const text = await runChat(BIOS_SYSTEM_PROMPT, userPrompt, 512);
  return extractJsonArray(text, isBio);
}

async function generateCaptions(userPrompt: string): Promise<string[] | null> {
  const text = await runChat(CAPTIONS_SYSTEM_PROMPT, userPrompt, 384);
  const captions = extractJsonArray(text, (item): item is string => typeof item === "string") ?? extractLines(text);
  return captions.length > 0 ? captions : null;
}

async function withRetry<T>(fn: () => Promise<T | null>): Promise<T | null> {
  return (await fn()) ?? (await fn());
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

  const bioPrompt = `${details}\n\nGive me bios for Instagram, X (Twitter), Facebook, and LinkedIn.`;
  const captionPrompt = `${details}\n\nGive me 5 caption starters for this business's social posts.`;

  try {
    // Run both generations in parallel — splitting into two simpler calls
    // doesn't cost any extra wall-clock time this way.
    const [bios, captions] = await Promise.all([
      withRetry(() => generateBios(bioPrompt)),
      withRetry(() => generateCaptions(captionPrompt)),
    ]);

    if (!bios || !captions) {
      return new Response(
        JSON.stringify({ ok: false, error: "Couldn't generate a bio that time — please try again." }),
        { status: 502 },
      );
    }

    // Fold in the character limit for each bio so the page can show a
    // live "X of Y characters" check without duplicating the list client-side.
    const biosWithLimits = bios.map((bio) => {
      const match = PLATFORM_LIMITS.find((p) => p.platform === bio.platform);
      return { ...bio, limit: match?.limit ?? 160 };
    });

    return new Response(JSON.stringify({ ok: true, bios: biosWithLimits, captions: captions.slice(0, 5) }), {
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
