// Free "Meta Title & Description Generator" tool (see /meta-tag-generator).
// Runs entirely on Cloudflare Workers AI — no external API key.
export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

const MODEL = "@cf/meta/llama-3.2-3b-instruct";

interface MetaPair {
  title: string;
  description: string;
}

const SYSTEM_PROMPT = `You write SEO title tags and meta descriptions for a small local business's website. Each pair must:
- Include the business's service/industry and city naturally — not stuffed or robotic
- Title tags: 45-60 characters, written like a real page title a person would click
- Meta descriptions: 120-158 characters, written like real ad copy that makes someone want to click — a benefit or reason to choose this business, not just a restatement of the title
- Avoid corporate jargon, buzzwords, and keyword stuffing
- Each of the 5 pairs should take a different angle (e.g. one on price, one on speed/convenience, one on trust/experience, one on a specific service, one on location)

Respond with ONLY a JSON array of exactly 5 objects, nothing else — no markdown, no commentary before or after. Example format:
[{"title": "Example Title Tag Here", "description": "Example meta description here that is roughly the right length and makes someone want to click."}]`;

function extractJsonArray(text: string): MetaPair[] | null {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;

  // The model occasionally emits a stray unescaped quote/apostrophe inside a
  // title or description, which breaks strict JSON.parse. Try as-is first,
  // then retry with straight quotes normalized to a form JSON.parse accepts.
  for (const candidate of [match[0], match[0].replace(/[‘’]/g, "'").replace(/[“”]/g, '"')]) {
    try {
      const parsed = JSON.parse(candidate);
      if (
        Array.isArray(parsed) &&
        parsed.every(
          (item) => item && typeof item.title === "string" && typeof item.description === "string",
        )
      ) {
        return parsed.map((item) => ({ title: item.title.trim(), description: item.description.trim() }));
      }
    } catch {
      // try next candidate / fall through
    }
  }
  return null;
}

// One generation + parse attempt. Returns null (never throws for a bad
// generation) so the caller can retry — a fresh generation is non-deterministic
// and often succeeds even when the previous one didn't parse cleanly.
async function generatePairs(userPrompt: string): Promise<MetaPair[] | null> {
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

  return extractJsonArray(text);
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
      JSON.stringify({ ok: false, error: "Tell us what your business does to get tailored tags." }),
      { status: 400 },
    );
  }

  const details = [
    business && `Business name: ${business}`,
    `Service/industry: ${service}`,
    city && `City: ${city}`,
  ]
    .filter(Boolean)
    .join("\n");

  const userPrompt = `${details}\n\nGive me 5 title tag + meta description pairs for this business's homepage.`;

  try {
    // A generation occasionally comes back with JSON the model broke with a
    // stray quote — that's non-deterministic, so a fresh attempt usually
    // succeeds even when the first one didn't. Retry once before failing.
    let pairs = await generatePairs(userPrompt);
    if (!pairs || pairs.length === 0) {
      pairs = await generatePairs(userPrompt);
    }

    if (!pairs || pairs.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "Couldn't generate tags that time — please try again." }),
        { status: 502 },
      );
    }

    return new Response(JSON.stringify({ ok: true, pairs: pairs.slice(0, 5) }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Meta tag generation failed:", error);
    return new Response(
      JSON.stringify({ ok: false, error: "Couldn't generate tags right now — please try again in a moment." }),
      { status: 502 },
    );
  }
};
