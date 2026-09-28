// Selected work, shown in a staggered two-column grid.
// Leave `href` or `image` empty to hide them.

export interface Project {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  year: string;
  href?: string;
  /** Path to an image in public/images, e.g. "/images/project-01.jpg". */
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
  image: "",
  imageAlt: "",
  ...overrides,
});

export const projects: Project[] = [
  placeholder(), // Project 01
  // Project 02 — shows the "Classified" overlay as an example. Remove `locked` if not needed.
  placeholder({ locked: true, lockedNote: "Walkthrough available privately", href: "" }),
  placeholder(), // Project 03
  placeholder(), // Project 04
  placeholder(), // Project 05
];
