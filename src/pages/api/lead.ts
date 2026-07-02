// Handles the questionnaire lead form: sends a notification to Johnny and an
// auto-reply (with the download link) to the submitter, both via Cloudflare
// Email Sending — sent from retroforgestudios.com so they land in the inbox
// instead of junk (unlike FormSubmit's shared-domain auto-replies).
export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { LEAD_MAGNET } from "../../data/site";

const NOTIFY_TO = "jgregory@retroforgestudios.com";
const FROM = { email: "hello@retroforgestudios.com", name: "Retro Forge Studios" };

function paragraphsToHtml(text: string) {
  return text
    .split("\n\n")
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  // Honeypot: bots fill this, humans don't.
  if (form.get("_honey")) {
    return redirect("/questionnaire/?sent=1", 302);
  }

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();

  if (!name || !email) {
    return redirect("/questionnaire/?error=1", 302);
  }

  try {
    await env.EMAIL.send({
      to: NOTIFY_TO,
      from: FROM,
      replyTo: email,
      subject: `New questionnaire download: ${LEAD_MAGNET.title}`,
      text: `New questionnaire download request\n\nName: ${name}\nEmail: ${email}`,
      html: `<p><strong>New questionnaire download request</strong></p><p>Name: ${name}<br>Email: ${email}</p>`,
    });

    await env.EMAIL.send({
      to: email,
      from: FROM,
      subject: "Your Website Project Questionnaire",
      text: LEAD_MAGNET.autoResponse,
      html: paragraphsToHtml(LEAD_MAGNET.autoResponse),
    });
  } catch (error) {
    console.error("Lead email send failed:", error);
    return redirect("/questionnaire/?error=1", 302);
  }

  return redirect("/questionnaire/?sent=1", 302);
};
