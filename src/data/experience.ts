// Work experience, newest first, shown as a stack of cards like the projects. The chat and llms.txt use it too.
// `shots` are screenshots or photos (in public/images); a role with several gets tabs, or a fan on phones.

export interface Experience {
  title: string;
  org: string;
  type: string;
  /** When, as shown, e.g. "Feb — May 2026" or "2 yrs". */
  year: string;
  description: string;
  tags: string[];
  shots: { name: string; image: string; imageMobile?: string }[];
}

const shot = (name: string, file: string) => ({
  name,
  image: `/images/experience/${file}.webp`,
  imageMobile: `/images/experience/${file}-mobile.webp`,
});

export const experience: Experience[] = [
  {
    title: "Freelance Developer",
    org: "contact.xyz · Dossier · Seam · LÜK",
    type: "Freelance",
    year: "3 mos",
    description: "Freelance work for four startups: contact.xyz, Dossier, Seam and LÜK.",
    tags: ["contact.xyz", "Dossier", "Seam", "LÜK"],
    shots: [shot("contact.xyz", "contact"), shot("Dossier", "dossier"), shot("Seam", "seam"), shot("LÜK", "luk")],
  },
  {
    title: "Freelance Web Developer & SEO",
    org: "Vite SEO",
    type: "Freelance",
    year: "2 yrs",
    description: "Websites and SEO for local businesses in Korea, like Hey George and BapNavi.",
    tags: ["Vite SEO", "Astro", "WordPress", "SEO"],
    shots: [
      { name: "Hey George", image: "/images/projects/hey-george.webp", imageMobile: "/images/projects/hey-george-mobile.webp" },
      { name: "BapNavi", image: "/images/projects/bapnavi.webp", imageMobile: "/images/projects/bapnavi-mobile.webp" },
    ],
  },
  {
    title: "Intern Project Lead",
    org: "DOST · Project LODI",
    type: "Internship",
    year: "Feb — May 2026",
    description:
      "Project lead in the League of Developers Initiative at the DOST Central Office IT Division. Built a QA documentation system with Python and an AI chatbot that turns user stories into test plans and test cases: 1–2 hours down to 10–20 minutes.",
    tags: ["DOST", "Project LODI", "Python", "AI chatbot"],
    shots: [
      { name: "DOST Central Office", image: "/images/experience/dost-office.webp" },
      { name: "QA docs system", image: "/images/experience/qa-docs.webp" },
    ],
  },
];
