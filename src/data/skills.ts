// Skills grouped by category; each category is a tab with its own turning wheel of logos.
// A logo is an image in public/images/skills (square, transparent background) or a Font Awesome icon.
// Remove all categories to hide the section.
import { faBullhorn, faMagnifyingGlassChart, type IconDefinition } from "@fortawesome/free-solid-svg-icons";

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
    ],
  },
  {
    name: "SEO",
    skills: [{ name: "[SEO TOOL]", logo: faMagnifyingGlassChart }],
  },
  {
    name: "Automations",
    skills: [{ name: "Botcake", logo: "/images/skills/botcake.png" }],
  },
  {
    name: "Digital Marketing",
    skills: [{ name: "[MARKETING TOOL]", logo: faBullhorn }],
  },
];
