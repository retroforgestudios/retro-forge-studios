import { projectFields, questionGroups, readinessItems, briefFields } from "../data/website-project.ts";

const MAX_BODY = 120_000;
const MAX_ANSWER = 2_000;
const ADDRESS = "jgregory@retroforgestudios.com";
type Send = (message: { to: string; from: { email: string; name: string }; replyTo: string; subject: string; text: string; html: string }) => Promise<unknown>;
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));
const reply = (status: number, message: string) => Response.json({ ok: status === 200, message }, { status, headers: { "Cache-Control": "no-store" } });

export async function handleWebsiteProject(request: Request, send: Send): Promise<Response> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return reply(403, "Please submit the form from our website.");
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) return reply(415, "Please use the website form.");
  const reader = request.body?.getReader();
  if (!reader) return reply(400, "Please complete the form.");
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BODY) { await reader.cancel(); return reply(413, "Your answers are too long. Please shorten them and try again."); }
    chunks.push(value);
  }
  const combined = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) { combined.set(chunk, offset); offset += chunk.length; }
  const form = new URLSearchParams(new TextDecoder().decode(combined));
  if (form.get("_honey")) return reply(200, "Thanks. Your project details have been sent.");
  const fields = [...projectFields, ...questionGroups.flatMap(group => [...group.questions]), ...briefFields];
  const answers = new Map<string, string>();
  for (const field of fields) {
    if (form.getAll(field.id).length > 1) return reply(400, "Please submit one answer per question.");
    const value = (form.get(field.id) || "").trim();
    if (value.length > MAX_ANSWER) return reply(400, "Please keep each answer under 2,000 characters.");
    if ("required" in field && field.required && !value) return reply(400, "Please enter your name, email address and business name.");
    answers.set(field.id, value);
  }
  const name = answers.get("name")!;
  const email = answers.get("email")!;
  const business = answers.get("business")!;
  if ([name, email, business].some(value => value.length > 200 || /[\r\n\x00-\x1f]/.test(value))) return reply(400, "Please check your contact details.");
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return reply(400, "Please enter a valid email address.");
  const website = answers.get("website");
  if (website) {
    try { if (!["http:", "https:"].includes(new URL(website).protocol)) throw new Error(); }
    catch { return reply(400, "Please enter a website address beginning with https:// or http://."); }
  }
  for (const key of ["target_launch", "approved_launch"]) {
    const value = answers.get(key);
    if (value && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0,10) !== value)) return reply(400, "Please check the launch dates.");
  }
  const ready = form.getAll("ready");
  if (ready.some(value => !readinessItems.includes(value as typeof readinessItems[number]))) return reply(400, "Please check the account readiness selections.");
  const blocks: { title: string; rows: { label: string; value: string }[] }[] = [
    { title: "Project details", rows: projectFields.map(field => ({ label: field.label, value: answers.get(field.id) || "Not provided" })) },
    { title: "Account readiness", rows: [{ label: "Completed or available", value: ready.length ? [...new Set(ready)].join("\n") : "Not specified" }] },
    ...questionGroups.map(group => ({ title: group.title, rows: group.questions.map(field => ({ label: field.number + ". " + field.label, value: answers.get(field.id) || "Not answered" })) })),
    { title: "Project brief and next steps", rows: briefFields.map(field => ({ label: field.label, value: answers.get(field.id) || "Not provided" })) }
  ];
  const text = "Website project guide submission\n\n" + blocks.map(block => block.title + "\n\n" + block.rows.map(row => row.label + "\n" + row.value).join("\n\n")).join("\n\n");
  const html = "<h1>Website project guide submission</h1>" + blocks.map(block => "<h2>" + escapeHtml(block.title) + "</h2>" + block.rows.map(row => "<p><strong>" + escapeHtml(row.label) + "</strong><br>" + escapeHtml(row.value).replace(/\n/g, "<br>") + "</p>").join("")).join("");
  try {
    await send({ to: ADDRESS, from: { email: "hello@retroforgestudios.com", name: "Retro Forge Studios" }, replyTo: email, subject: "Website project questionnaire: " + business, text, html });
  } catch {
    console.error("Website project submission email failed");
    return reply(503, "We couldn't send your answers. Please try again. Your answers are still on this page.");
  }
  return reply(200, "Thanks. Your project details have been sent to Johnny at Retro Forge Studios.");
}
