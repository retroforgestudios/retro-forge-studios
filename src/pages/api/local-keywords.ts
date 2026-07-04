// Free "Local Keyword Ideas Generator" tool (see /local-keyword-generator).
// Runs entirely on Cloudflare Workers AI — no paid keyword-research API
// (Ahrefs/SEMrush) needed for a free tool like this.
export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

const MODEL = "@cf/meta/llama-3.2-3b-instruct";

const SYSTEM_PROMPT = `You write local search keyword ideas for a small business's website and Google Business Profile. The phrases must:
- Sound like something a real customer would actually type into Google — natural search phrasing, not robotic keyword-stuffing
- Be long-tail (specific), not just "[industry] [city]" repeated — vary the angle: urgency ("emergency", "same-day", "24 hour"), price ("affordable", "cheap", "best"), "near me" phrasing, specific services within the industry, and questions ("how much does... cost in [city]")
- Include the city naturally in most (not all) phrases — some should be plain "near me" style since that's how people actually search
- Be lowercase, like real search queries

Respond with ONLY a JSON array of exactly 15 strings, nothing else — no markdown, no numbering, no commentary before or after. Example format:
["emergency hvac repair omaha", "same-day ac repair near me"]`;

function extractJsonArray(text: string): string[] | null {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;

  // The model occasionally emits a stray unescaped quote/apostrophe that
  // breaks strict JSON.parse. Try as-is first, then with smart quotes
  // normalized to straight quotes.
  for (const candidate of [match[0], match[0].replace(/[‘’]/g, "'").replace(/[“”]/g, '"')]) {
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
        return parsed.map((s) => s.trim()).filter(Boolean);
      }
    } catch {
      // try next candidate / fall through
    }
  }
  return null;
}

// Fallback if the model doesn't return clean JSON: pull one phrase per line,
// stripping common list markers ("1.", "-", quotes) so the tool still works.
function extractLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[\s"'\-*\d.)]+/, "").replace(/["']+$/, "").trim())
    .filter((line) => line.length > 5 && line.length < 120)
    .slice(0, 15);
}

async function generateKeywords(userPrompt: string): Promise<string[] | null> {
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

  const keywords = extractJsonArray(text) ?? extractLines(text);
  return keywords.length > 0 ? keywords : null;
}

export const POST: APIRoute = async ({ request }) => {
  let industry = "";
  let city = "";
  try {
    const body = await request.json();
    industry = String(body.industry ?? "").trim().slice(0, 80);
    city = String(body.city ?? "").trim().slice(0, 80);
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Something went wrong. Please try again." }), { status: 400 });
  }

  if (!industry) {
    return new Response(
      JSON.stringify({ ok: false, error: "Tell us your industry to get tailored keyword ideas." }),
      { status: 400 },
    );
  }

  const userPrompt = city
    ? `Business industry: ${industry}\nCity: ${city}\n\nGive me 15 local search keyword phrases for this business.`
    : `Business industry: ${industry}\n\nGive me 15 local search keyword phrases for this business (use "near me" phrasing since no city was given).`;

  try {
    // A generation occasionally comes back malformed — that's
    // non-deterministic, so a fresh attempt usually succeeds even when the
    // first one didn't. Retry once before failing.
    let keywords = await generateKeywords(userPrompt);
    if (!keywords) {
      keywords = await generateKeywords(userPrompt);
    }

    if (!keywords) {
      return new Response(
        JSON.stringify({ ok: false, error: "Couldn't generate keyword ideas that time — please try again." }),
        { status: 502 },
      );
    }

    return new Response(JSON.stringify({ ok: true, keywords: keywords.slice(0, 15) }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Local keyword generation failed:", error);
    return new Response(
      JSON.stringify({ ok: false, error: "Couldn't generate keyword ideas right now — please try again in a moment." }),
      { status: 502 },
    );
  }
};
