// Personal details used across the site. Replace every [PLACEHOLDER].
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

export const site = {
  name: "Jerome Tegrado",
  // What search engines and link previews show. Title ≤ 60 characters, description ≤ 155.
  title: "Jerome Tegrado | AI-Native Builder: Web, SEO & Automation",
  description:
    "Jerome Tegrado is an AI-native builder: websites, tools and automations that make a business easier to run. Magna Cum Laude, TUP Manila (2026).",
  headline: "AI-Native Builder",
  intro: "I love learning new things!",
  // Optional: put a photo in public/images and set e.g. "/images/portrait.webp". Leave empty for a placeholder.
  // An ASCII lens follows the mouse over it on hover.
  portrait: "/images/portrait.webp",
  email: "tegradojeromebrent@gmail.com",
  // The status line at the top of the contact pane, with a green dot. Empty availability hides it.
  availability: "open to work",
  lookingFor: "remote startup roles, ops, web, ai automation",
  // Resume link shown in the footer (a PDF in public/ or a Google Drive link).
  resume: "/Jerome-Tegrado-Resume.pdf",

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
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jerome-brent-tegrado", icon: faLinkedin },
];
