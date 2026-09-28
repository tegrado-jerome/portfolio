// Personal details used across the site. Replace every [PLACEHOLDER].
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

export const site = {
  name: "Jerome Tegrado",
  title: "Jerome Tegrado | [YOUR HEADLINE]",
  description: "[SHORT SITE DESCRIPTION FOR SEARCH ENGINES AND SOCIAL PREVIEWS]",
  headline: "[YOUR SHORT PROFESSIONAL HEADLINE]",
  intro: "[YOUR SHORT INTRODUCTION / DESCRIPTION]",
  // Optional: put a photo in public/images and set e.g. "/images/portrait.jpg". Leave empty for a placeholder.
  // It shows in black & white and turns to colour (with an ASCII lens) on hover.
  portrait: "/images/portrait.jpg",
  email: "[EMAIL]",
  // Optional: a resume link shown in the header. Leave empty to hide it.
  resume: "",

  // Full-screen loading intro.
  preloader: {
    label: "Portfolio of Jerome Tegrado",
    title: "[PRELOADER TAGLINE]",
    // Background photo behind the intro.
    image: "/images/loading.jpg",
  },

  // Your photo for the round chat button, e.g. "/images/avatar.jpg" (a square photo in public/images).
  // Leave empty to show the JT logo instead.
  chatAvatar: "/images/chat-avatar.jpg",

  // Photo the page fades into at the bottom.
  footerImage: "/images/footer.jpg",

  // Optional: your IANA time zone (e.g. "Europe/London") to show a live local-time clock in the footer.
  timezone: "",

  // Optional 1200×630 social preview image in public/images, e.g. "/images/og.jpg".
  ogImage: "",

};

export const socials = [
  { label: "LinkedIn", href: "#", icon: faLinkedinIn }, // [LINKEDIN URL]
  { label: "GitHub", href: "#", icon: faGithub }, // [GITHUB URL]
];
