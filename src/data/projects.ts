// Selected work. The first project is shown full-width as the featured entry.
// Leave `href`, `github` or `image` empty to hide them.

export interface Project {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  year: string;
  href?: string;
  github?: string;
  /** Path to an image in /public, e.g. "/projects/project-01.jpg". */
  image?: string;
  imageAlt?: string;
  /** Under NDA: the cover shows a "Classified" overlay on hover and doesn't link anywhere. */
  locked?: boolean;
  lockedNote?: string;
}

const placeholder = (overrides: Partial<Project> = {}): Project => ({
  title: "[PROJECT NAME]",
  description: "[PROJECT DESCRIPTION]",
  category: "[CATEGORY]",
  technologies: ["[TECH 1]", "[TECH 2]", "[TECH 3]"],
  year: "[YEAR]",
  href: "#",
  github: "#",
  image: "",
  imageAlt: "",
  ...overrides,
});

export const projects: Project[] = [
  placeholder(), // Project 01
  // Project 02 — shows the "Classified" overlay as an example. Remove `locked` if not needed.
  placeholder({ locked: true, lockedNote: "Walkthrough available privately", href: "", github: "" }),
  placeholder(), // Project 03
  placeholder(), // Project 04
  placeholder(), // Project 05
];
