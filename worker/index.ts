// Cloudflare Worker: serves the static site and the chat endpoint (/api/chat).
// The Gemini API key lives only here, as a Worker secret — it never reaches the browser.
import { CANARY, systemPrompt } from "./prompt";

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
const SYSTEM_PROMPT = systemPrompt();

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname !== "/api/chat") return env.ASSETS.fetch(request);
    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
    return chat(request, env);
  },
};

async function chat(request: Request, env: Env): Promise<Response> {
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

  const model = env.GEMINI_MODEL || "gemini-3.1-flash-lite";
  const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: 1024, thinkingConfig: { thinkingLevel: "low" } },
      safetySettings: SAFETY_CATEGORIES.map((category) => ({ category, threshold: "BLOCK_MEDIUM_AND_ABOVE" })),
    }),
  });

  if (!upstream.ok) {
    // Log details for the owner; never forward provider errors to visitors.
    console.error("Gemini request failed", upstream.status, await upstream.text());
    return json({ error: "Chat's down right now. Try again later." }, 502);
  }

  const data: GeminiResponse = await upstream.json();
  const reply = (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("").trim();
  // Blocked prompts, empty replies and anything echoing the system prompt get a safe fallback.
  if (!reply || data.promptFeedback?.blockReason || reply.includes(CANARY)) return json({ reply: FALLBACK });
  return json({ reply: withoutDashes(reply) });
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
