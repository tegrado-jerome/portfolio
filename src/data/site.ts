// Personal details used across the site. Replace every [PLACEHOLDER].
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

export const site = {
  name: "Jerome Tegrado",
  title: "Jerome Tegrado — [YOUR HEADLINE]",
  description: "[SHORT SITE DESCRIPTION FOR SEARCH ENGINES AND SOCIAL PREVIEWS]",
  headline: "[YOUR SHORT PROFESSIONAL HEADLINE]",
  intro: "[YOUR SHORT INTRODUCTION / DESCRIPTION]",
  // Optional: put a photo in /public and set e.g. "/portrait.jpg". Leave empty for a placeholder.
  // It shows in black & white and turns to colour (with an ASCII lens) on hover.
  portrait: "",
  email: "[EMAIL]",
  // Optional: a resume link shown in the header. Leave empty to hide it.
  resume: "",

  // Full-screen loading intro.
  preloader: {
    label: "Portfolio — Jerome Tegrado",
    title: "[PRELOADER TAGLINE]",
    // Optional background photo, e.g. "/preloader.jpg".
    image: "",
  },

  // Optional: your IANA time zone (e.g. "Europe/London") to show a live local-time clock in the footer.
  timezone: "",

  // Optional wide photo for the footer, e.g. "/footer.jpg" (black & white works best).
  footerImage: "",

  // The "folder" section. Set `show: false` to remove it.
  archive: {
    show: true,
    title: "Archive",
    description: "[ONE-LINE DESCRIPTION OF WHAT'S INSIDE]",
    href: "#", // [ARCHIVE LINK]
    // Up to three images that pop out of the folder on hover, e.g. "/archive/1.jpg".
    images: ["", "", ""],
  },
};

export const socials = [
  { label: "LinkedIn", href: "#", icon: faLinkedinIn }, // [LINKEDIN URL]
  { label: "GitHub", href: "#", icon: faGithub }, // [GITHUB URL]
];
