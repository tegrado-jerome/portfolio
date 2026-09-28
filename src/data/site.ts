// Personal details used across the site. Replace every [PLACEHOLDER].
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

export const site = {
  name: "Jerome Tegrado",
  // What search engines and link previews show. Title ≤ 60 characters, description ≤ 155.
  title: "Jerome Tegrado | Web Developer, SEO & AI Automation",
  description:
    "Jerome Tegrado builds websites, SEO and AI automations. Magna Cum Laude graduate of the Technological University of the Philippines, Manila (2026).",
  headline: "Web Developer, SEO & AI Automation",
  intro: "I f*cking love learning new things!",
  // Optional: put a photo in public/images and set e.g. "/images/portrait.webp". Leave empty for a placeholder.
  // An ASCII lens follows the mouse over it on hover.
  portrait: "/images/portrait.webp",
  email: "tegradojeromebrent@gmail.com",
  // Resume link shown in the footer (a PDF in public/ or a Google Drive link).
  resume: "[RESUME URL]",

  // Honor shown over the hero portrait. Remove to hide the caption.
  honor: {
    title: "Magna Cum Laude",
    detail: "GWA 1.36",
    school: "Technological University of the Philippines",
    logo: "/images/tup-seal.webp",
  },

  // Your photo for the round chat button, e.g. "/images/avatar.jpg" (a square photo in public/images).
  // Leave empty to show the JT logo instead.
  chatAvatar: "/images/chat-avatar.webp",

  // 1200×630 social preview image in public/images (shown when the link is shared).
  ogImage: "/images/og.jpg",

  // Google Search Console: the "content" value of its HTML-tag verification, e.g. "abc123...". Empty = no tag.
  gscVerification: "yzVljoblX-g-awcer0JQPb9rMiGpC3tReC5j21b52Z4",
  // Google Analytics 4 measurement ID, e.g. "G-XXXXXXX". Empty = no analytics.
  gaId: "G-BS752S4BCT",
};

// "Let's talk" opens a new Gmail message to me in the browser.
export const contactHref = site.email.includes("@")
  ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}`
  : "#contact";

export const socials = [
  { label: "LinkedIn", href: "[LINKEDIN URL]", icon: faLinkedin },
];
