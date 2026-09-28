// Awards and honours, newest first. Real ones only; a link to proof (certificate, announcement)
// makes one credible. Remove all entries to hide the section.

export interface Award {
  title: string;
  issuer: string;
  year: string;
  detail?: string;
  href?: string;
}

export const awards: Award[] = [
  {
    title: "Magna Cum Laude",
    issuer: "Technological University of the Philippines, Manila",
    year: "2026",
    detail: "GWA 1.36 · Rank 14 of 2,800+",
  },
  { title: "[AWARD]", issuer: "[ORGANISATION]", year: "[YEAR]", href: "" },
  { title: "[AWARD]", issuer: "[ORGANISATION]", year: "[YEAR]", href: "" },
];
