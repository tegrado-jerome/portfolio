// /humans.txt — the colophon (humanstxt.org). Built from site data; placeholders are skipped.
import type { APIRoute } from "astro";
import { site, socials } from "../data/site";
import { isSet } from "../lib/content";
import { lastCommit } from "../lib/build-info";

export const GET: APIRoute = ({ site: siteUrl }) => {
  const lines = ["/* TEAM */", `  Name: ${site.name}`, `  Site: ${new URL("/", siteUrl).href}`];
  if (isSet(site.email)) lines.push(`  Contact: ${site.email}`);
  socials.filter((s) => isSet(s.href)).forEach((s) => lines.push(`  ${s.label}: ${s.href}`));

  lines.push(
    "",
    "/* SITE */",
    ...(lastCommit ? [`  Last update: ${lastCommit.date.replaceAll("-", "/")}`] : []),
    "  Language: English",
    "  Standards: HTML, CSS, schema.org JSON-LD",
    "  Components: Astro, Tailwind CSS, Font Awesome",
    "  Fonts: Instrument Serif, Hanken Grotesk",
    "  Hosting: Cloudflare Workers",
    "",
  );

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
