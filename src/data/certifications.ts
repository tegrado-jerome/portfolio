// Certifications, in the order they should show. Real ones only; the verify link (Credly, Coursera, Google, etc.)
// makes one credible and turns the card into a link. Remove all entries to hide the section.

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
  /** Public page where anyone can verify it. */
  href?: string;
  /** Picture of the certificate in public/images/certifications, e.g. "/images/certifications/google-ads.webp" (shown whole). */
  image?: string;
  imageAlt?: string;
}

export const certifications: Certification[] = [
  {
    name: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    year: "2026",
    credentialId: "86D0F00E82F670F",
    image: "/images/certifications/azure-fundamentals.webp",
    imageAlt: "Microsoft Certified: Azure Fundamentals certificate",
  },
  {
    name: "Lean Six Sigma Green Belt",
    issuer: "Council for Six Sigma Certification",
    year: "2026",
    credentialId: "CSS-LSSGB-00922",
    image: "/images/certifications/lean-six-sigma-green-belt.webp",
    imageAlt: "Certified Lean Six Sigma Green Belt certificate",
  },
  {
    name: "AWS Concepts",
    issuer: "DataCamp",
    year: "2026",
    image: "/images/certifications/aws-concepts.webp",
    imageAlt: "DataCamp statement of accomplishment for AWS Concepts",
  },
  {
    name: "Introduction to SQL",
    issuer: "DataCamp",
    year: "2026",
    image: "/images/certifications/introduction-to-sql.webp",
    imageAlt: "DataCamp statement of accomplishment for Introduction to SQL",
  },
  {
    name: "Microsoft Azure Fundamentals (AZ-900)",
    issuer: "DataCamp",
    year: "2026",
    image: "/images/certifications/azure-fundamentals-az-900-course.webp",
    imageAlt: "DataCamp statement of accomplishment for Microsoft Azure Fundamentals (AZ-900)",
  },
  {
    name: "Introduction to GitHub Concepts",
    issuer: "DataCamp",
    year: "2026",
    image: "/images/certifications/introduction-to-github-concepts.webp",
    imageAlt: "DataCamp statement of accomplishment for Introduction to GitHub Concepts",
  },
  {
    name: "Understanding Cloud Computing",
    issuer: "DataCamp",
    year: "2026",
    image: "/images/certifications/understanding-cloud-computing.webp",
    imageAlt: "DataCamp statement of accomplishment for Understanding Cloud Computing",
  },
];
