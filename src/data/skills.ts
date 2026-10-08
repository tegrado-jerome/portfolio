// Skills grouped by category; each category is a tab with its own turning wheel of logos.
// A logo is an image in public/images/skills (square, transparent background) or a Font Awesome icon.
// Remove all categories to hide the section.
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

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
    name: "AI Coding Agents",
    skills: [
      { name: "Claude Code", logo: logo("claude-code.svg") },
      { name: "Codex", logo: logo("codex.png") },
      { name: "OpenCode", logo: logo("opencode.png") },
      { name: "Manus", logo: logo("manus.png") },
      { name: "MCP", logo: logo("mcp.svg"), mono: true },
    ],
  },
  {
    name: "AI Models",
    skills: [
      { name: "Claude", logo: logo("claude.svg") },
      { name: "ChatGPT", logo: logo("chatgpt.svg"), mono: true },
      { name: "Gemini", logo: logo("gemini.svg") },
      { name: "DeepSeek", logo: logo("deepseek.svg") },
      { name: "Groq", logo: logo("groq.svg") },
    ],
  },
  {
    name: "Frontend",
    skills: [
      { name: "React", logo: logo("react.svg") },
      { name: "Astro", logo: logo("astro.svg") },
      { name: "TypeScript", logo: logo("typescript.svg") },
      { name: "Tailwind CSS", logo: logo("tailwindcss.svg") },
      { name: "GSAP", logo: logo("gsap.svg") },
      { name: "MapLibre", logo: logo("maplibre.svg") },
    ],
  },
  {
    name: "CMS",
    skills: [
      { name: "WordPress", logo: logo("wordpress.svg") },
      { name: "Elementor", logo: logo("elementor.svg") },
    ],
  },
  {
    name: "Cloud & Backend",
    skills: [
      { name: "Cloudflare Workers", logo: logo("cloudflare-workers.svg") },
      { name: "Azure", logo: logo("azure.svg") },
      { name: "Supabase", logo: logo("supabase.svg") },
      { name: "Redis", logo: logo("redis.svg") },
    ],
  },
  {
    name: "Dev Tools",
    skills: [
      { name: "VS Code", logo: logo("vscode.png") },
      { name: "GitHub Actions", logo: logo("github-actions.svg") },
      { name: "Playwright", logo: logo("playwright.svg") },
    ],
  },
  {
    name: "SEO & Analytics",
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
    name: "Chatbot Automation",
    skills: [{ name: "Botcake", logo: logo("botcake.png") }],
  },
];
