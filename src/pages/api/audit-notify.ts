// Fire-and-forget notification when someone clicks "Download My Results" on
// the /website-audit tool — emails Johnny so he knows a lead pulled a copy
// of their report. Called client-side without being awaited by the actual
// PDF generation, so a slow/failed email never delays or breaks the download.
export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

const NOTIFY_TO = "jgregory@retroforgestudios.com";
const FROM = { email: "hello@retroforgestudios.com", name: "Retro Forge Studios" };

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const url = String(body.url ?? "").slice(0, 300);
    const score = Number(body.score);
    const grade = String(body.grade ?? "").slice(0, 2);

    if (!url) return new Response(null, { status: 204 });

    await env.EMAIL.send({
      to: NOTIFY_TO,
      from: FROM,
      subject: `Website audit PDF downloaded: ${url}`,
      text: `Someone downloaded their audit report.\n\nSite audited: ${url}\nScore: ${Number.isFinite(score) ? score + "%" : "n/a"}\nGrade: ${grade || "n/a"}`,
      html: `<p><strong>Someone downloaded their audit report.</strong></p><p>Site audited: ${url}<br>Score: ${Number.isFinite(score) ? score + "%" : "n/a"}<br>Grade: ${grade || "n/a"}</p>`,
    });
  } catch (error) {
    console.error("Audit-download notification failed:", error);
  }

  return new Response(null, { status: 204 });
};
