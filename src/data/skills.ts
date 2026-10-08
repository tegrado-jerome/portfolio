// Skills grouped by category; each category is a tab with its own turning wheel of logos.
// A logo is an image in public/images/skills (square, transparent background) or a Font Awesome icon.
// Remove all categories to hide the section.
import { faBullhorn, type IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface Skill {
  name: string;
  logo: string | IconDefinition;
}

export interface SkillGroup {
  name: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    name: "Website Development",
    skills: [
      { name: "VS Code", logo: "/images/skills/vscode.png" },
      { name: "Claude Code", logo: "/images/skills/claude-code.svg" },
      { name: "React", logo: "/images/skills/react.svg" },
      { name: "Astro", logo: "/images/skills/astro.svg" },
      { name: "TypeScript", logo: "/images/skills/typescript.svg" },
      { name: "Tailwind CSS", logo: "/images/skills/tailwindcss.svg" },
      { name: "GSAP", logo: "/images/skills/gsap.svg" },
      { name: "WordPress", logo: "/images/skills/wordpress.svg" },
      { name: "Elementor", logo: "/images/skills/elementor.svg" },
      { name: "MapLibre", logo: "/images/skills/maplibre.svg" },
    ],
  },
  {
    name: "AI",
    skills: [
      { name: "Gemini", logo: "/images/skills/gemini.svg" },
      { name: "Groq", logo: "/images/skills/groq.svg" },
    ],
  },
  {
    name: "Cloud & Data",
    skills: [
      { name: "Cloudflare Workers", logo: "/images/skills/cloudflare-workers.svg" },
      { name: "Azure", logo: "/images/skills/azure.svg" },
      { name: "Supabase", logo: "/images/skills/supabase.svg" },
      { name: "Redis", logo: "/images/skills/redis.svg" },
    ],
  },
  {
    name: "SEO",
    skills: [
      { name: "Google Search Console", logo: "/images/skills/google-search-console.svg" },
      { name: "Google Analytics 4", logo: "/images/skills/google-analytics.svg" },
      { name: "Yoast SEO", logo: "/images/skills/yoast.svg" },
      { name: "Rank Math SEO", logo: "/images/skills/rank-math.png" },
    ],
  },
  {
    name: "Automations",
    skills: [
      { name: "Botcake", logo: "/images/skills/botcake.png" },
      { name: "Messenger", logo: "/images/skills/messenger.svg" },
      { name: "GitHub Actions", logo: "/images/skills/github-actions.svg" },
      { name: "Playwright", logo: "/images/skills/playwright.svg" },
    ],
  },
  {
    name: "Digital Marketing",
    skills: [{ name: "[MARKETING TOOL]", logo: faBullhorn }],
  },
];
