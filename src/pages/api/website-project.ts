export const prerender = false;
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { handleWebsiteProject } from "../../lib/website-project";

export const POST: APIRoute = async ({ request }) => {
  let response: Response;
  try {
    response = await handleWebsiteProject(request, (message) => env.EMAIL.send(message));
  } catch {
    response = Response.json({ ok: false, message: "We couldn't read your form. Please try again." }, { status: 400 });
  }
  if (request.headers.get("accept")?.includes("application/json")) return response;
  const result = await response.json() as { message: string };
  const title = response.ok ? "Your project details have been sent" : "We couldn't send your details";
  const safeMessage = result.message.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));
  return new Response(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>' + title + ' | Retro Forge Studios</title><style>body{margin:0;background:#f2f2f2;color:#202020;font:18px/1.7 system-ui,sans-serif}header{background:#202020;padding:24px}header img{width:180px;height:auto}main{max-width:680px;margin:64px auto;padding:0 24px}h1{line-height:1.25}a{color:#1f7a93}p{margin:24px 0}</style></head><body><header><a href="/"><img src="/images/logo-wordmark.webp" alt="Retro Forge Studios"></a></header><main><h1>' + title + '</h1><p>' + safeMessage + '</p>' + (response.ok ? '<p>Johnny will review your answers and follow up using the email you provided.</p>' : '<p>Use your browser Back button to return to your answers, or email <a href="mailto:jgregory@retroforgestudios.com">jgregory@retroforgestudios.com</a>.</p>') + '<p><a href="/website-project-guide/">Return to the website project guide</a></p></main></body></html>',
    { status: response.status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
};
