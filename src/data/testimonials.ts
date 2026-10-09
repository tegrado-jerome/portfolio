// Real quotes only — from clients or colleagues who agreed to be quoted. Two or three is plenty.
// Linking to the person (LinkedIn recommendation, their site) makes a quote credible.
// An entry without a quote stays hidden; with none left the section hides.

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  year: string;
  href?: string;
  /** Their photo in public/images, e.g. "/images/testimonials/ana.webp" (square). Empty = a person icon. */
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "Jerome and I worked side by side at Vite SEO on site builds, blog content and SEO. He's quick to learn, careful with details, and easy to work with.",
    name: "Mark Rainier Armas",
    role: "QA Engineer",
    company: "Fuseable",
    year: "",
    href: "",
    avatar: "/images/testimonials/mark.webp",
  },
  {
    quote: "I led Jerome at Vite SEO. He picked up our SEO work fast, delivered on time, and took ownership of the websites and content he handled.",
    name: "Ferdinand Cadorna",
    role: "SEO Team Lead",
    company: "Vite SEO",
    year: "",
    href: "",
    avatar: "/images/testimonials/ferdinand.webp",
  },
  {
    quote: "Jerome and I went through Lean Six Sigma certification together. He thinks in processes and always looks for the simpler, cleaner way to do things.",
    name: "Von Harl Rian",
    role: "Aeronautical Engineering Graduate",
    company: "PATTS College of Aeronautics",
    year: "",
    href: "",
    avatar: "/images/testimonials/von.webp",
  },
  {
    quote: "We freelanced together for car agents, setting up their Facebook pages with Botcake chat automation. Jerome made the bots work smoothly and the clients happy.",
    name: "Benz Bautista",
    role: "Freelancer",
    company: "484 Media",
    year: "",
    href: "",
    avatar: "/images/testimonials/benz.webp",
  },
  {
    quote: "Jerome and I built the Citimotors and RS Carson websites. He's a clear communicator and handled the client side as well as the code.",
    name: "Macko Buenviaje",
    role: "BSIT Graduate",
    company: "NU MOA",
    year: "",
    href: "",
    avatar: "/images/testimonials/macko.webp",
  },
];
