// Projects, shown as a sticky stack of cards (the first on the bottom).
// Leave `href`, `year` or `image` empty to hide them.

export interface Project {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  year?: string;
  href?: string;
  /** Path to an image in public/images, e.g. "/images/project-01.jpg". */
  image?: string;
  /** A phone-sized screenshot, shown instead of `image` on small screens. */
  imageMobile?: string;
  imageAlt?: string;
  /** Under NDA: the cover shows a "Classified" overlay on hover and doesn't link anywhere. */
  locked?: boolean;
  lockedNote?: string;
}

export const projects: Project[] = [
  {
    title: "GalaTayo",
    description: "Find places around the Philippines and plan trips with friends.",
    category: "Web app",
    technologies: ["React", "Vite", "Supabase", "Leaflet"],
    href: "https://galatayo.app/",
    image: "/images/projects/galatayo.webp",
    imageMobile: "/images/projects/galatayo-mobile.webp",
    imageAlt: "GalaTayo home page with a search bar and photos of Philippine spots",
  },
  {
    title: "Hey George",
    description: "Website for a pasta and steak restaurant in Seoul.",
    category: "Restaurant website",
    technologies: ["Astro", "Cloudflare"],
    href: "https://hey-george.com/",
    image: "/images/projects/hey-george.webp",
    imageMobile: "/images/projects/hey-george-mobile.webp",
    imageAlt: "Hey George home page with a plate of steak and fries",
  },
  {
    title: "Citimotors",
    description: "Website for a Mitsubishi dealer in Metro Manila.",
    category: "Business website",
    technologies: ["Astro", "Cloudflare Workers"],
    href: "https://citimotors.tegradojeromebrent.workers.dev/",
    image: "/images/projects/citimotors.webp",
    imageMobile: "/images/projects/citimotors-mobile.webp",
    imageAlt: "Citimotors home page with an orange Mitsubishi Triton",
  },
  {
    title: "RS Carson",
    description: "Careers site for a construction company.",
    category: "Careers website",
    technologies: ["Astro", "Cloudflare Workers"],
    href: "https://rscarsongencon.tegradojeromebrent.workers.dev/",
    image: "/images/projects/rs-carson.webp",
    imageMobile: "/images/projects/rs-carson-mobile.webp",
    imageAlt: "RS Carson careers page with workers in hard hats",
  },
  {
    title: "BapNavi",
    description: "Guide to Korean restaurants in Seoul, Busan and Jeju.",
    category: "Food guide",
    technologies: ["WordPress"],
    href: "https://bapnavi.com/en/",
    image: "/images/projects/bapnavi.webp",
    imageMobile: "/images/projects/bapnavi-mobile.webp",
    imageAlt: "BapNavi home page with a Korean grill dish",
  },
];
