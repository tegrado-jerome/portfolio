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
    quote: "",
    name: "Mark Rainier Armas",
    role: "QA Engineer",
    company: "Fuseable",
    year: "",
    href: "",
    avatar: "/images/testimonials/mark.webp",
  },
  {
    quote: "",
    name: "Ferdinand Cadorna",
    role: "SEO Team Lead",
    company: "Vite SEO",
    year: "",
    href: "",
    avatar: "/images/testimonials/ferdinand.webp",
  },
  {
    quote: "",
    name: "Von Harl Rian",
    role: "Aeronautical Engineering Graduate",
    company: "PATTS College of Aeronautics",
    year: "",
    href: "",
    avatar: "/images/testimonials/von.webp",
  },
  {
    quote: "",
    name: "Benz Bautista",
    role: "Freelancer",
    company: "484 Media",
    year: "",
    href: "",
    avatar: "/images/testimonials/benz.webp",
  },
  {
    quote: "",
    name: "Macko Buenviaje",
    role: "BSIT Graduate",
    company: "NU MOA",
    year: "",
    href: "",
    avatar: "/images/testimonials/macko.webp",
  },
];
