// Tools and skills shown as logo tiles above "Kind words". Each needs a logo: an image in
// public/images/skills (square, transparent background) or a Font Awesome icon.
// Remove all entries to hide the section.
import { faBullhorn, faMagnifyingGlassChart, type IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface Skill {
  name: string;
  logo: string | IconDefinition;
}

export const skills: Skill[] = [
  { name: "Botcake", logo: "/images/skills/botcake.png" },
  { name: "VS Code", logo: "/images/skills/vscode.png" },
  { name: "Claude Code", logo: "/images/skills/claude-code.svg" },
  { name: "SEO", logo: faMagnifyingGlassChart },
  { name: "Digital Marketing", logo: faBullhorn },
];
