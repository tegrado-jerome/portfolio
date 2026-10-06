// Cloudflare Worker: serves the static site and the chat endpoint (/api/chat).
// The Gemini API key lives only here, as a Worker secret — it never reaches the browser.
//
// To keep the chat up, a reply comes from the first source that gives one: each Gemini model in GEMINI_MODELS in
// turn (each has its own quota, and a busy one gets a quick retry), then Cloudflare's own Workers AI as a last
// resort, so the chat still answers while Google is down or out of quota. A reply cut off part-way is redone by the
// next source, or, if none can, trimmed back to its last full sentence.
import { CANARY, showTargets, systemPrompt } from "./prompt";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  GEMINI_API_KEY?: string;
  /** Comma-separated Gemini models, tried in order. */
  GEMINI_MODELS?: string;
  /** Comma-separated origins allowed to call the API, e.g. "https://jerome.dev". Empty = any. */
  ALLOWED_ORIGINS?: string;
  CHAT_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
  AI?: { run(model: string, input: object): Promise<{ response?: string }> };
}

type ChatMessage = { role: "user" | "assistant"; content: string };

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
};

/** How a source's reply ended: whole, cut short by the length limit, blocked, or failed / cut off. */
type End = "stop" | "long" | "blocked" | "failed";
/** One place a reply can come from: yields the text as it's written, then says how it ended. */
type Source = () => AsyncGenerator<string, End>;

const LIMITS = { bodyChars: 16_000, messages: 12, messageChars: 800 };
const FALLBACK = "I can only talk about my work here. Ask me about my projects or skills.";
const SAFETY_CATEGORIES = [
  "HARM_CATEGORY_HARASSMENT",
  "HARM_CATEGORY_HATE_SPEECH",
  "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  "HARM_CATEGORY_DANGEROUS_CONTENT",
];
const BLOCKED_FINISH = new Set(["SAFETY", "RECITATION", "BLOCKLIST", "PROHIBITED_CONTENT", "SPII"]);
// A busy model (5xx) gets a quick retry; one out of quota (429) hands straight over to the next.
const RETRY_STATUSES = new Set([500, 503, 504]);
const RETRY_DELAYS_MS = [400, 1000];
const CONNECT_TIMEOUT_MS = 10_000; // a model that hasn't started answering by then is skipped
const DEFAULT_MODELS = "gemini-3.1-flash-lite";
const WORKERS_AI_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const MAX_TOKENS = 2048;
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

  if (env.CHAT_LIMITER) {
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.CHAT_LIMITER.limit({ key: ip });
    if (!success) return json({ error: "Too many messages. Wait a minute and try again." }, 429);
  }

  const body = await request.text();
  if (body.length > LIMITS.bodyChars) return json({ error: "That's too long. Try a shorter message." }, 413);
  const messages = parseMessages(body);
  if (!messages) return json({ error: "Invalid request." }, 400);

  const key = env.GEMINI_API_KEY;
  const ai = env.AI;
  const models = (env.GEMINI_MODELS || DEFAULT_MODELS).split(",").map((m) => m.trim()).filter(Boolean);
  const sources: Source[] = [
    ...(key ? models.map((model) => () => fromGemini(key, model, messages)) : []),
    ...(ai ? [() => fromWorkersAi(ai, messages)] : []),
  ];
  if (!sources.length) return json({ error: "Chat isn't set up yet." }, 503);

  // The reply streams to the visitor as newline-separated JSON: {text} pieces as they're written, then {show}
  // when it points at part of the page. {replace} swaps out everything sent so far (a redo, or the safe fallback).
  // Nothing at all means every source failed, and the page says the chat is down.
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const send = (line: object) => writer.write(encoder.encode(`${JSON.stringify(line)}\n`));

  const relay = async () => {
    let sent = ""; // what the visitor has so far
    let final = ""; // the finished reply
    let finalRaw = "";
    let partial = ""; // the longest cut-off reply, kept in case no source finishes one
    let partialRaw = "";
    let blocked = false;
    for (const source of sources) {
      const reply = source();
      let raw = "";
      let ours = false; // the visitor's text so far came from this source
      let end: End;
      for (;;) {
        const step = await reply.next();
        if (step.done) {
          end = step.value;
          break;
        }
        raw += step.value;
        // Anything echoing the system prompt is cut off at once.
        if (raw.includes(CANARY)) {
          end = "blocked";
          break;
        }
        const text = visible(raw, false);
        if (!ours) {
          if (!text) continue;
          await send(sent ? { replace: text } : { text });
          sent = text;
          ours = true;
        } else if (text.length > sent.length && text.startsWith(sent)) {
          await send({ text: text.slice(sent.length) });
          sent = text;
        }
      }
      if (end === "blocked") {
        blocked = true;
        break;
      }
      const text = visible(raw, true);
      if (text && (end === "stop" || end === "long")) {
        final = end === "long" ? wholeSentences(text) : text;
        finalRaw = raw;
        break;
      }
      if (text.length > partial.length) [partial, partialRaw] = [text, raw];
    }
    if (!blocked && !final && partial) [final, finalRaw] = [wholeSentences(partial), partialRaw];

    if (blocked) await send({ replace: FALLBACK });
    else if (final && !final.startsWith(sent)) await send({ replace: final });
    else if (final.length > sent.length) await send({ text: final.slice(sent.length) });
    // The page part to scroll to, only if it's one the site really has. The tag itself never reaches the visitor.
    const show = [...finalRaw.matchAll(SHOW)].map((m) => m[1].toLowerCase()).findLast((t) => SHOW_TARGETS.has(t));
    if (final && !blocked && show) await send({ show });
    await writer.close();
  };
  ctx.waitUntil(relay());
  return new Response(readable, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}

/** A reply from one Gemini model, streamed. */
async function* fromGemini(key: string, model: string, messages: ChatMessage[]): AsyncGenerator<string, End> {
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: MAX_TOKENS, thinkingConfig: { thinkingLevel: "minimal" } },
    safetySettings: SAFETY_CATEGORIES.map((category) => ({ category, threshold: "BLOCK_MEDIUM_AND_ABOVE" })),
  });
  try {
    let res: Response;
    for (let attempt = 0; ; attempt++) {
      const timeout = new AbortController();
      const timer = setTimeout(() => timeout.abort(), CONNECT_TIMEOUT_MS);
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: payload,
        signal: timeout.signal,
      }).finally(() => clearTimeout(timer));
      if (res.ok || !RETRY_STATUSES.has(res.status) || attempt >= RETRY_DELAYS_MS.length) break;
      await res.body?.cancel();
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
    }
    if (!res.ok) {
      // Logged for the owner; provider errors never reach visitors.
      console.error("Gemini request failed", model, res.status, await res.text());
      return "failed";
    }
    let end: End = "failed"; // a stream that stops without saying why was cut off
    for await (const chunk of events(res.body!)) {
      if (chunk.promptFeedback?.blockReason) return "blocked";
      const candidate = chunk.candidates?.[0];
      const text = (candidate?.content?.parts ?? []).map((p) => p.text ?? "").join("");
      if (text) yield text;
      const reason = candidate?.finishReason;
      if (reason) end = reason === "STOP" ? "stop" : reason === "MAX_TOKENS" ? "long" : BLOCKED_FINISH.has(reason) ? "blocked" : "failed";
    }
    if (end === "failed") console.error("Gemini reply cut off", model);
    return end;
  } catch (error) {
    console.error("Gemini stream failed", model, error);
    return "failed";
  }
}

/** The last resort: a whole reply from Cloudflare Workers AI, used only when no Gemini model answers. */
async function* fromWorkersAi(ai: NonNullable<Env["AI"]>, messages: ChatMessage[]): AsyncGenerator<string, End> {
  try {
    const { response } = await ai.run(WORKERS_AI_MODEL, {
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: MAX_TOKENS,
    });
    if (!response?.trim()) return "failed";
    yield response;
    return "stop";
  } catch (error) {
    console.error("Workers AI failed", error);
    return "failed";
  }
}

/** A reply cut off mid-sentence, trimmed back to its last full sentence (or left as it is if it has none). */
function wholeSentences(text: string) {
  const last = [...text.matchAll(/[.!?](?=\s|$)/g)].at(-1);
  return last ? text.slice(0, last.index + 1) : text;
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
