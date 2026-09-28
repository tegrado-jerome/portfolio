// Certifications, newest first. Real ones only; the verify link (Credly, Coursera, Google, etc.)
// makes one credible and turns the card into a link. Remove all entries to hide the section.

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
  /** Public page where anyone can verify it. */
  href?: string;
  /** Picture of the certificate in public/images/certifications, e.g. "/images/certifications/google-ads.webp" (4:5 portrait). */
  image?: string;
  imageAlt?: string;
}

const placeholder: Certification = { name: "[CERTIFICATION]", issuer: "[ISSUER]", year: "[YEAR]", credentialId: "", href: "" };

export const certifications: Certification[] = [placeholder, placeholder, placeholder, placeholder];
