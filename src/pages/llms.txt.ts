// /llms.txt — a plain-Markdown summary of the site for AI assistants and answer engines.
// Built from the same data as the page; placeholder values are skipped.
import type { APIRoute } from "astro";
import { capabilities, site, socials } from "../data/site";
import { experience } from "../data/experience";
import { projects } from "../data/projects";
import { isSet, onlySet } from "../lib/content";

export const GET: APIRoute = ({ site: siteUrl }) => {
  const home = new URL("/", siteUrl).href;
  const lines: string[] = [`# ${site.name}`, ""];

  const summary = onlySet([site.headline, site.intro]).join(" — ");
  if (summary) lines.push(`> ${summary}`, "");

  const about = onlySet(site.about);
  if (about.length) lines.push("## About", "", ...about.flatMap((p) => [p, ""]));

  const journey = experience.filter((e) => isSet(e.description));
  if (journey.length) {
    lines.push("## Experience", "");
    journey.forEach((e) => lines.push(`- ${onlySet([e.year, e.title]).join(" — ")}: ${e.description}`));
    lines.push("");
  }

  const work = projects.filter((p) => isSet(p.title));
  if (work.length) {
    lines.push("## Selected work", "");
    work.forEach((p) => {
      const title = isSet(p.href) ? `[${p.title}](${p.href})` : p.title;
      const meta = onlySet([p.category, p.year, onlySet(p.technologies).join(", ")]).join(" · ");
      lines.push(`- ${title}${isSet(p.description) ? `: ${p.description}` : ""}${meta ? ` (${meta})` : ""}`);
    });
    lines.push("");
  }

  const skills = capabilities
    .map((c) => ({ title: c.title, items: onlySet(c.items) }))
    .filter((c) => c.items.length);
  if (skills.length) {
    lines.push("## Capabilities", "");
    skills.forEach((c) => lines.push(`- ${c.title}: ${c.items.join(", ")}`));
    lines.push("");
  }

  lines.push("## Contact", "", `- Website: ${home}`);
  if (isSet(site.email)) lines.push(`- Email: ${site.email}`);
  socials.filter((s) => isSet(s.href)).forEach((s) => lines.push(`- ${s.label}: ${s.href}`));

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
