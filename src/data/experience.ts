// Timeline entries, oldest first. The chat and llms.txt use them. Replace every [PLACEHOLDER].
export interface Experience {
  year: string;
  title: string;
  description: string;
}

export const experience: Experience[] = [
  { year: "[YEAR]", title: "Beginning", description: "[SHORT DESCRIPTION]" },
  { year: "[YEAR]", title: "[EXPERIENCE]", description: "[SHORT DESCRIPTION]" },
  { year: "[YEAR]", title: "[EDUCATION]", description: "[SHORT DESCRIPTION]" },
  { year: "[YEAR]", title: "[EXPERIENCE]", description: "[SHORT DESCRIPTION]" },
  { year: "[YEAR]", title: "Now", description: "[SHORT DESCRIPTION]" },
];
