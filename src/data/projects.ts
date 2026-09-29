// Projects, shown as a bento grid: the first one is the tall featured card.
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
  /** Optional ticket stub under the card (like a receipt), in a colour taken from the image. */
  stub?: { eyebrow: string; title: string; code: string };
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
  // Project 01 — the featured (tall) card, with a ticket stub as an example. Remove `stub` if not needed.
  placeholder({
    stub: { eyebrow: "[WHERE IT ALL BEGAN]", title: "[THE STORY BEHIND THIS PROJECT, ONE LINE]", code: "[CODE]" },
  }),
  // Project 02 — shows the "Classified" overlay as an example. Remove `locked` if not needed.
  placeholder({ locked: true, lockedNote: "Walkthrough available privately", href: "" }),
  placeholder(), // Project 03
  placeholder(), // Project 04
  placeholder(), // Project 05
];
