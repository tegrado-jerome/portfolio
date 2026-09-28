// Real quotes only — from clients or colleagues who agreed to be quoted. Two or three is plenty.
// Linking to the person (LinkedIn recommendation, their site) makes a quote credible.
// Remove all entries to hide the section.

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  year: string;
  href?: string;
  /** Their photo in public/images, e.g. "/images/testimonial-ana.webp" (square). Empty = a person icon. */
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "[A REAL QUOTE FROM A CLIENT OR COLLEAGUE, ONE OR TWO SENTENCES]",
    name: "[NAME]",
    role: "[ROLE]",
    company: "[COMPANY]",
    year: "[YEAR]",
    href: "", // [LINK TO THEIR LINKEDIN OR SITE]
    avatar: "", // [THEIR PHOTO]
  },
  {
    quote: "[A REAL QUOTE FROM A CLIENT OR COLLEAGUE, ONE OR TWO SENTENCES]",
    name: "[NAME]",
    role: "[ROLE]",
    company: "[COMPANY]",
    year: "[YEAR]",
    href: "",
    avatar: "",
  },
];
