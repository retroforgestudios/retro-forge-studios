// Handles the traditional contact form: sends a notification to Johnny via
// Cloudflare Email Sending — sent from retroforgestudios.com so it lands in
// the inbox instead of junk.
export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

const NOTIFY_TO = "jgregory@retroforgestudios.com";
const FROM = { email: "hello@retroforgestudios.com", name: "Retro Forge Studios" };

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  // Honeypot: bots fill this, humans don't.
  if (form.get("_honey")) {
    return redirect("/contact/?sent=1", 302);
  }

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return redirect("/contact/?error=1", 302);
  }

  try {
    await env.EMAIL.send({
      to: NOTIFY_TO,
      from: FROM,
      replyTo: email,
      subject: `New message from ${name} via retroforgestudios.com`,
      text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>New contact form submission</strong></p><p>Name: ${name}<br>Email: ${email}</p><p>${message.replace(/\n/g, "<br>")}</p>`,
    });
  } catch (error) {
    console.error("Contact email send failed:", error);
    return redirect("/contact/?error=1", 302);
  }

  return redirect("/contact/?sent=1", 302);
};
