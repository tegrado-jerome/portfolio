// Skills grouped by category; each category is a tab with its own turning wheel of logos.
// A logo is an image in public/images/skills (square, transparent background) or a Font Awesome icon.
// Remove all categories to hide the section.
import { faBullhorn, type IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface Skill {
  name: string;
  logo: string | IconDefinition;
  /** A black logo, turned white in the dark theme. */
  mono?: boolean;
}

export interface SkillGroup {
  name: string;
  skills: Skill[];
}

const logo = (file: string) => `/images/skills/${file}`;

export const skillGroups: SkillGroup[] = [
  {
    name: "AI",
    skills: [
      { name: "Claude Code", logo: logo("claude-code.svg") },
      { name: "Codex", logo: logo("codex.png") },
      { name: "OpenCode", logo: logo("opencode.png") },
      { name: "Claude", logo: logo("claude.svg") },
      { name: "ChatGPT", logo: logo("chatgpt.svg"), mono: true },
      { name: "Gemini", logo: logo("gemini.svg") },
      { name: "DeepSeek", logo: logo("deepseek.svg") },
      { name: "Manus", logo: logo("manus.png") },
      { name: "Groq", logo: logo("groq.svg") },
      { name: "MCP", logo: logo("mcp.svg"), mono: true },
    ],
  },
  {
    name: "Website Development",
    skills: [
      { name: "VS Code", logo: logo("vscode.png") },
      { name: "React", logo: logo("react.svg") },
      { name: "Astro", logo: logo("astro.svg") },
      { name: "TypeScript", logo: logo("typescript.svg") },
      { name: "Tailwind CSS", logo: logo("tailwindcss.svg") },
      { name: "GSAP", logo: logo("gsap.svg") },
      { name: "WordPress", logo: logo("wordpress.svg") },
      { name: "Elementor", logo: logo("elementor.svg") },
      { name: "MapLibre", logo: logo("maplibre.svg") },
      { name: "Playwright", logo: logo("playwright.svg") },
    ],
  },
  {
    name: "Cloud & DevOps",
    skills: [
      { name: "Cloudflare Workers", logo: logo("cloudflare-workers.svg") },
      { name: "Azure", logo: logo("azure.svg") },
      { name: "Supabase", logo: logo("supabase.svg") },
      { name: "Redis", logo: logo("redis.svg") },
      { name: "GitHub Actions", logo: logo("github-actions.svg") },
    ],
  },
  {
    name: "SEO",
    skills: [
      { name: "Google Search Console", logo: logo("google-search-console.svg") },
      { name: "Google Analytics 4", logo: logo("google-analytics.svg") },
      { name: "Yoast SEO", logo: logo("yoast.svg") },
      { name: "Rank Math SEO", logo: logo("rank-math.png") },
      { name: "Ahrefs", logo: logo("ahrefs.png") },
      { name: "Semrush", logo: logo("semrush.svg") },
    ],
  },
  {
    name: "Automations",
    skills: [{ name: "Botcake", logo: logo("botcake.png") }],
  },
  {
    name: "Digital Marketing",
    skills: [{ name: "[MARKETING TOOL]", logo: faBullhorn }],
  },
];
