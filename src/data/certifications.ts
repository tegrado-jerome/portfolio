// Certifications, newest first. Real ones only; the verify link (Credly, Coursera, Google, etc.)
// makes one credible and turns the name into a link. Remove all entries to hide the section.

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
  /** Public page where anyone can verify it. */
  href?: string;
}

export const certifications: Certification[] = [
  { name: "[CERTIFICATION]", issuer: "[ISSUER]", year: "[YEAR]", credentialId: "", href: "" },
  { name: "[CERTIFICATION]", issuer: "[ISSUER]", year: "[YEAR]", credentialId: "", href: "" },
];
