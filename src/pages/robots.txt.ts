import type { APIRoute } from "astro";

// Everything is public. AI search/answer crawlers are named explicitly so it's clear they're welcome.
const aiCrawlers = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"];

export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      "User-agent: *",
      "Allow: /",
      "",
      ...aiCrawlers.flatMap((bot) => [`User-agent: ${bot}`, "Allow: /", ""]),
      `Sitemap: ${new URL("sitemap-index.xml", site)}`,
      "",
    ].join("\n"),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
