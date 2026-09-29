// Cloudflare Worker: serves the static site and the chat endpoint (/api/chat).
// The Gemini API key lives only here, as a Worker secret — it never reaches the browser.
import { CANARY, showTargets, systemPrompt } from "./prompt";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  /** Comma-separated origins allowed to call the API, e.g. "https://jerome.dev". Empty = any. */
  ALLOWED_ORIGINS?: string;
  CHAT_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

type ChatMessage = { role: "user" | "assistant"; content: string };

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
};

const LIMITS = { bodyChars: 16_000, messages: 12, messageChars: 800 };
const FALLBACK = "I can only talk about my work here. Ask me about my projects or skills.";
const SAFETY_CATEGORIES = [
  "HARM_CATEGORY_HARASSMENT",
  "HARM_CATEGORY_HATE_SPEECH",
  "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  "HARM_CATEGORY_DANGEROUS_CONTENT",
];
const RETRY_STATUSES = new Set([429, 500, 503, 504]);
const RETRY_DELAYS_MS = [300, 800, 1500];
const SYSTEM_PROMPT = systemPrompt();
const SHOW_TARGETS = new Set(showTargets());
const SHOW = /\[\[\s*show\s*:\s*([\w/-]+)\s*\]\]/gi;

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export default {
  async fetch(request: Request, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }): Promise<Response> {
    if (new URL(request.url).pathname !== "/api/chat") return env.ASSETS.fetch(request);
    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
    return chat(request, env, ctx);
  },
};

async function chat(request: Request, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }): Promise<Response> {
  const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean);
  const origin = request.headers.get("Origin");
  if (allowed.length && (!origin || !allowed.includes(origin))) return json({ error: "Forbidden." }, 403);

  if (!env.GEMINI_API_KEY) return json({ error: "Chat isn't set up yet." }, 503);

  if (env.CHAT_LIMITER) {
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.CHAT_LIMITER.limit({ key: ip });
    if (!success) return json({ error: "Too many messages. Wait a minute and try again." }, 429);
  }

  const body = await request.text();
  if (body.length > LIMITS.bodyChars) return json({ error: "That's too long. Try a shorter message." }, 413);
  const messages = parseMessages(body);
  if (!messages) return json({ error: "Invalid request." }, 400);

  const model = env.GEMINI_MODEL || "gemini-3-flash-preview";
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: 1024, thinkingConfig: { thinkingLevel: "minimal" } },
    safetySettings: SAFETY_CATEGORIES.map((category) => ({ category, threshold: "BLOCK_MEDIUM_AND_ABOVE" })),
  });

  // Gemini often answers 503 "high demand" for a moment, so a busy model gets a few quick retries.
  let upstream: Response;
  for (let attempt = 0; ; attempt++) {
    upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: payload,
    });
    if (upstream.ok || !RETRY_STATUSES.has(upstream.status) || attempt >= RETRY_DELAYS_MS.length) break;
    await upstream.body?.cancel();
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
  }

  if (!upstream.ok) {
    // Log details for the owner; never forward provider errors to visitors.
    console.error("Gemini request failed", upstream.status, await upstream.text());
    return json({ error: "Chat's down right now. Try again later." }, 502);
  }

  // The reply streams to the visitor as newline-separated JSON: {text} pieces as Gemini writes them, then
  // {show} when it points at part of the page. {replace} swaps out everything sent so far (the safe fallback).
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const send = (line: object) => writer.write(encoder.encode(`${JSON.stringify(line)}\n`));

  const relay = async () => {
    let raw = "";
    let sent = "";
    let blocked = false;
    try {
      for await (const chunk of events(upstream.body!)) {
        if (chunk.promptFeedback?.blockReason) blocked = true;
        raw += (chunk.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("");
        // Anything echoing the system prompt is cut off at once.
        if (blocked || raw.includes(CANARY)) break;
        const text = visible(raw, false);
        if (text.length > sent.length && text.startsWith(sent)) {
          await send({ text: text.slice(sent.length) });
          sent = text;
        }
      }
    } catch (error) {
      console.error("Gemini stream failed", error);
    }
    const text = blocked || raw.includes(CANARY) ? "" : visible(raw, true);
    if (!text) await send({ replace: FALLBACK });
    else if (!text.startsWith(sent)) await send({ replace: text });
    else if (text.length > sent.length) await send({ text: text.slice(sent.length) });
    // The page part to scroll to, only if it's one the site really has. The tag itself never reaches the visitor.
    const show = [...raw.matchAll(SHOW)].map((m) => m[1].toLowerCase()).findLast((t) => SHOW_TARGETS.has(t));
    if (text && show) await send({ show });
    await writer.close();
  };
  ctx.waitUntil(relay());
  return new Response(readable, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}

/** The parsed `data:` events of Gemini's server-sent event stream. */
async function* events(body: ReadableStream<Uint8Array<ArrayBuffer>>): AsyncGenerator<GeminiResponse> {
  let buffer = "";
  for await (const piece of body.pipeThrough(new TextDecoderStream())) {
    buffer += piece;
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      const data = block.split(/\r?\n/).filter((l) => l.startsWith("data:")).map((l) => l.slice(5)).join("");
      if (data.trim()) yield JSON.parse(data);
    }
  }
}

/**
 * The text a visitor may see. Mid-stream it holds back the tail, which could still turn into a [[show]] tag,
 * the canary or a dash that needs fixing, so what's sent never has to change.
 */
function visible(raw: string, done: boolean) {
  let text = raw;
  if (!done) {
    text = text.slice(0, Math.max(0, text.length - CANARY.length));
    const tag = text.lastIndexOf("[[");
    if (tag !== -1 && !text.slice(tag).includes("]]")) text = text.slice(0, tag);
    text = text.replace(/[\s[—–-]+$/, "");
  }
  return withoutDashes(text.replace(SHOW, "").trim());
}

/** The site never shows em or en dashes; this catches any the model writes anyway. */
function withoutDashes(text: string) {
  return text
    .replace(/(\d)\s*[–—]\s*(\d)/g, "$1-$2") // ranges like 2021–2025
    .replace(/\s*[—–]\s*/g, ", ");
}

/** Accepts only a short, well-formed, alternating conversation that ends with the visitor. */
function parseMessages(body: string): ChatMessage[] | null {
  let input: unknown;
  try {
    input = JSON.parse(body);
  } catch {
    return null;
  }
  const list = (input as { messages?: unknown })?.messages;
  if (!Array.isArray(list) || list.length === 0 || list.length > LIMITS.messages) return null;

  const messages: ChatMessage[] = [];
  for (const [i, item] of list.entries()) {
    const { role, content } = (item ?? {}) as Partial<ChatMessage>;
    const expected = i % 2 === 0 ? "user" : "assistant";
    if (role !== expected || typeof content !== "string") return null;
    // Drop control characters (keep newlines and tabs).
    const text = content.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "").trim();
    if (!text || text.length > LIMITS.messageChars) return null;
    messages.push({ role, content: text });
  }
  return messages.at(-1)?.role === "user" ? messages : null;
}
