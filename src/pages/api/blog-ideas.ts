// Free "Blog Topic Generator" tool (see /blog-topic-generator). Runs
// entirely on Cloudflare Workers AI — no external API key, unlike the
// PageSpeed integration on the audit tool.
export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

const MODEL = "@cf/meta/llama-3.2-3b-instruct";

const SYSTEM_PROMPT = `You write blog topic ideas for a small business's website. The ideas must:
- Be specific to the business's industry and city — not generic marketing advice
- Sound like something a real local customer would search for or care about
- Avoid corporate jargon, buzzwords, and clickbait
- Be phrased as an actual blog post title, not a vague topic

Respond with ONLY a JSON array of exactly 10 strings, nothing else — no markdown, no numbering, no commentary before or after. Example format:
["Title one", "Title two", "Title three"]`;

function extractJsonArray(text: string): string[] | null {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return parsed.map((s) => s.trim()).filter(Boolean);
    }
  } catch {
    // fall through
  }
  return null;
}

// Fallback if the model doesn't return clean JSON: pull one idea per line,
// stripping common list markers ("1.", "-", quotes) so the tool still works.
function extractLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[\s"'\-*\d.)]+/, "").replace(/["']+$/, "").trim())
    .filter((line) => line.length > 8 && line.length < 200)
    .slice(0, 10);
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
    return new Response(JSON.stringify({ ok: false, error: "Tell us your industry to get tailored ideas." }), { status: 400 });
  }

  const userPrompt = city
    ? `Business industry: ${industry}\nCity: ${city}\n\nGive me 10 blog post title ideas for this business.`
    : `Business industry: ${industry}\n\nGive me 10 blog post title ideas for this business.`;

  try {
    const result = (await env.AI.run(MODEL, {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      // Default max_tokens is only 256 — cutting it close for 10 titles in
      // JSON. See social-bio.ts for the truncation bug this guards against.
      max_tokens: 768,
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
    const ideas = extractJsonArray(text) ?? extractLines(text);

    if (ideas.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "Couldn't generate ideas that time — please try again." }),
        { status: 502 },
      );
    }

    return new Response(JSON.stringify({ ok: true, ideas: ideas.slice(0, 10) }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Blog idea generation failed:", error);
    return new Response(
      JSON.stringify({ ok: false, error: "Couldn't generate ideas right now — please try again in a moment." }),
      { status: 502 },
    );
  }
};
