import test from "node:test";
import assert from "node:assert/strict";
import { handleWebsiteProject } from "../src/lib/website-project.ts";
import { questionGroups, readinessItems } from "../src/data/website-project.ts";

const makeRequest = (overrides = {}, headers = {}) => new Request("https://retroforgestudios.com/api/website-project", {
  method: "POST",
  headers: { origin: "https://retroforgestudios.com", ...headers },
  body: new URLSearchParams({ name: "Website Test", email: "test@example.com", business: "Test Business", ...overrides }),
});
test("all 37 questions are distinct and sequential", () => {
  const questions = questionGroups.flatMap(group => [...group.questions]);
  assert.equal(questions.length, 37);
  assert.equal(new Set(questions.map(q => q.id)).size, 37);
  assert.deepEqual(questions.map(q => q.number), Array.from({ length: 37 }, (_, i) => i + 1));
});
test("complete form emails every answer and readiness item to the fixed inbox", async () => {
  const answers = Object.fromEntries(Array.from({ length: 37 }, (_, i) => ["q" + (i + 1), "Answer number " + (i + 1)]));
  const request = makeRequest({ ...answers, ready: readinessItems[0], agreed_scope: "Five pages", target_launch: "2026-12-01" });
  let sent;
  const response = await handleWebsiteProject(request, async message => { sent = message; });
  assert.equal(response.status, 200);
  assert.equal(sent.to, "jgregory@retroforgestudios.com");
  assert.equal(sent.replyTo, "test@example.com");
  for (let i = 1; i <= 37; i++) assert.ok(sent.text.includes("Answer number " + i));
  assert.ok(sent.text.includes("Five pages"));
  assert.ok(sent.text.includes(readinessItems[0]));
  assert.ok(sent.html.includes("Website project guide submission"));
});
test("minimal required details are enough", async () => {
  assert.equal((await handleWebsiteProject(makeRequest(), async () => {})).status, 200);
});
test("user content is escaped in email HTML", async () => {
  let sent;
  await handleWebsiteProject(makeRequest({ q1: '<img src=x onerror="alert(1)"> & text' }), async message => { sent = message; });
  assert.ok(!sent.html.includes("<img"));
  assert.ok(sent.html.includes("&lt;img"));
  assert.ok(sent.text.includes("<img"));
});
test("honeypot accepts silently without sending email", async () => {
  let calls = 0;
  assert.equal((await handleWebsiteProject(makeRequest({ _honey: "spam" }), async () => { calls++; })).status, 200);
  assert.equal(calls, 0);
});
test("missing and malformed contact fields never send", async () => {
  for (const bad of [{ name: "" }, { business: "" }, { email: "bad" }, { name: "Header\r\ninjection" }, { email: "a@b.com\nOther: value" }]) {
    let calls = 0;
    assert.equal((await handleWebsiteProject(makeRequest(bad), async () => { calls++; })).status, 400);
    assert.equal(calls, 0);
  }
});
test("cross-origin, oversized and wrong content type requests never send", async () => {
  let calls = 0;
  const send = async () => { calls++; };
  assert.equal((await handleWebsiteProject(makeRequest({}, { origin: "https://untrusted.example" }), send)).status, 403);
  assert.equal((await handleWebsiteProject(makeRequest({ q1: "a".repeat(130000) }), send)).status, 413);
  assert.equal((await handleWebsiteProject(new Request("https://retroforgestudios.com/api/website-project", { method: "POST", body: "{}" }), send)).status, 415);
  assert.equal(calls, 0);
});
test("oversized answers, invalid dates, unsafe URLs and unknown readiness are rejected", async () => {
  for (const bad of [{ q1: "a".repeat(2001) }, { target_launch: "2026-02-31" }, { website: "javascript:alert(1)" }, { ready: "fake" }]) {
    assert.equal((await handleWebsiteProject(makeRequest(bad), async () => { throw new Error("Must not send"); })).status, 400);
  }
});
test("duplicate question fields are rejected", async () => {
  const request = makeRequest();
  const data = new URLSearchParams(await request.text());
  data.append("q1", "first");
  data.append("q1", "second");
  assert.equal((await handleWebsiteProject(new Request(request.url, { method: "POST", body: data }), async () => {})).status, 400);
});
test("provider failure returns a retryable error, not false success", async () => {
  const response = await handleWebsiteProject(makeRequest(), async () => { throw new Error("Provider unavailable"); });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
});
