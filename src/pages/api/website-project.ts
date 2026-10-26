export const prerender = false;
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { handleWebsiteProject } from "../../lib/website-project";

export const POST: APIRoute = async ({ request, redirect }) => {
  let response: Response;
  try {
    response = await handleWebsiteProject(request, (message) => env.EMAIL.send(message));
  } catch {
    response = Response.json({ ok: false, message: "We couldn't read your form. Please try again." }, { status: 400 });
  }
  if (request.headers.get("accept")?.includes("application/json")) return response;
  return redirect(response.ok ? "/website-project-guide/?sent=1#project-form" : "/website-project-guide/?error=1#project-form", 303);
};
