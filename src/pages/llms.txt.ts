// /llms.txt — a plain-Markdown summary of the site for AI assistants and answer engines.
// Built from the same data as the page; placeholder values are skipped.
import type { APIRoute } from "astro";
import { site, socials } from "../data/site";
import { experience } from "../data/experience";
import { projects } from "../data/projects";
import { skillGroups } from "../data/skills";
import { isSet, onlySet } from "../data/placeholders";

export const GET: APIRoute = ({ site: siteUrl }) => {
  const home = new URL("/", siteUrl).href;
  const lines: string[] = [`# ${site.name}`, ""];

  const summary = onlySet([site.headline, site.intro]).join(". ");
  if (summary) lines.push(`> ${summary}`, "");

  const journey = experience.filter((e) => isSet(e.description));
  if (journey.length) {
    lines.push("## Experience", "");
    journey.forEach((e) => lines.push(`- ${onlySet([e.year, e.title]).join(", ")}: ${e.description}`));
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

  const skillLines = skillGroups
    .map((g) => ({ group: g.name, names: onlySet(g.skills.map((s) => s.name)) }))
    .filter((g) => g.names.length)
    .map((g) => `- ${g.group}: ${g.names.join(", ")}`);
  if (skillLines.length) lines.push("## Skills", "", ...skillLines, "");

  lines.push("## Contact", "", `- Website: ${home}`);
  if (isSet(site.email)) lines.push(`- Email: ${site.email}`);
  socials.filter((s) => isSet(s.href)).forEach((s) => lines.push(`- ${s.label}: ${s.href}`));

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
