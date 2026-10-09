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
  /** Several screenshots instead of one: thumbnails switch them on wide screens, and they fan out on phones. */
  gallery?: { name: string; image: string; imageMobile?: string }[];
  /** Under NDA: the cover shows a "Classified" overlay on hover and doesn't link anywhere. */
  locked?: boolean;
  lockedNote?: string;
}

export const projects: Project[] = [
  {
    title: "GalaTayo",
    description: "Find places around the Philippines and plan trips with friends.",
    category: "Web app",
    technologies: ["React", "Azure Functions", "Supabase", "Redis", "Gemini", "Groq"],
    href: "https://galatayo.app/",
    image: "/images/projects/galatayo.webp",
    imageMobile: "/images/projects/galatayo-mobile.webp",
    imageAlt: "GalaTayo home page with a search bar and photos of Philippine spots",
  },
  {
    title: "Hey George",
    description: "Website for a pasta and steak restaurant in Seoul.",
    category: "Restaurant website",
    technologies: ["Astro", "Cloudflare Workers", "Headless WordPress", "Groq", "Tailwind CSS"],
    href: "https://hey-george.com/",
    image: "/images/projects/hey-george.webp",
    imageMobile: "/images/projects/hey-george-mobile.webp",
    imageAlt: "Hey George home page with a plate of steak and fries",
  },
  {
    title: "Citimotors",
    description: "Website for a Mitsubishi dealer in Metro Manila.",
    category: "Business website",
    technologies: ["Astro", "Tailwind CSS", "GSAP", "Cloudflare Workers"],
    href: "https://citimotors.tegradojeromebrent.workers.dev/",
    image: "/images/projects/citimotors.webp",
    imageMobile: "/images/projects/citimotors-mobile.webp",
    imageAlt: "Citimotors home page with an orange Mitsubishi Triton",
  },
  {
    title: "RS Carson",
    description: "Careers site for a construction company.",
    category: "Careers website",
    technologies: ["Astro", "Tailwind CSS", "Cloudflare Workers", "Turnstile"],
    href: "https://rscarsongencon.tegradojeromebrent.workers.dev/",
    image: "/images/projects/rs-carson.webp",
    imageMobile: "/images/projects/rs-carson-mobile.webp",
    imageAlt: "RS Carson careers page with workers in hard hats",
  },
  {
    title: "BapNavi",
    description: "Guide to Korean restaurants in Seoul, Busan and Jeju.",
    category: "Food guide",
    technologies: ["WordPress", "Elementor", "MapLibre", "Gemini"],
    href: "https://bapnavi.com/en/",
    image: "/images/projects/bapnavi.webp",
    imageMobile: "/images/projects/bapnavi-mobile.webp",
    imageAlt: "BapNavi home page with a Korean grill dish",
  },
  {
    title: "UpSpace",
    description: "Marketplace for booking coworking spaces, with tools for space partners and admins. Team capstone, ranked #1 in BSIS.",
    category: "Capstone · team",
    technologies: ["Next.js","TypeScript","Supabase","Prisma","Redis","Gemini"],
    year: "2025–2026",
    href: "https://upspaceph.com/",
    image: "/images/projects/upspace.webp",
    imageMobile: "/images/projects/upspace-mobile.webp",
    imageAlt: "UpSpace sign-in page: find the perfect space for meaningful work",
  },
  {
    title: "QA Documentation System",
    description: "Turns user stories into test plans and test cases with Python and an AI chatbot: 1–2 hours of writing down to 10–20 minutes.",
    category: "Automation",
    technologies: ["Python","AI chatbot","Prompt design"],
    year: "2026",
    image: "/images/projects/qa-docs.webp",
    imageAlt: "The QA documentation generator's Python code in an editor",
  },
  {
    title: "Lean Six Sigma Green Belt",
    description: "DMAIC case study on cutting employee onboarding time, using AI to grow the data from 2 columns to 30+. Scored 95%.",
    category: "Case study",
    technologies: ["Lean Six Sigma","ChatGPT","Claude","Gemini","Manus"],
    year: "2026",
    image: "/images/projects/lean-six-sigma.webp",
    imageMobile: "/images/projects/lean-six-sigma-mobile.webp",
    imageAlt: "Cover of the Lean Six Sigma Green Belt case study on reducing employee onboarding cycle time",
  },
  {
    title: "Azure Security Labs",
    description: "Six hands-on Azure labs on network security and troubleshooting, with costs kept under $1.",
    category: "Cloud labs",
    technologies: ["Azure","VNets","NSGs","VMs"],
    year: "2026",
    image: "/images/projects/azure-labs.webp",
    imageAlt: "Azure portal showing the lab's resource group of VMs, NSGs and ASGs",
  },
];
