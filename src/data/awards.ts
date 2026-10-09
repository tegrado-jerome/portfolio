// Awards and honours, in the order they should show, as photo cards. Real ones only; a link to proof (certificate,
// announcement) makes one credible. Remove all entries to hide the section.

export interface Award {
  title: string;
  issuer: string;
  year: string;
  detail?: string;
  /** Short name for the card caption (e.g. "TUP Manila"); the full issuer still goes to search engines and the chat. */
  short?: string;
  href?: string;
  /** Photo in public/images/awards, e.g. "/images/awards/magna-cum-laude.webp" (the medal, ceremony or certificate). */
  image?: string;
  imageAlt?: string;
  /** A certificate or letter rather than a photo: shown whole instead of cropped to fill. */
  document?: boolean;
}

export const awards: Award[] = [
  {
    title: "Thesis Award",
    issuer: "Technological University of the Philippines, Manila",
    year: "2026",
    detail: "4th Annual Research Colloquium",
    short: "TUP Manila",
    image: "/images/awards/thesis-award.webp",
    imageAlt: "Jerome and his thesis team holding their bound theses and medals at TUP's 4th Annual Research Colloquium",
  },
  {
    title: "Magna Cum Laude",
    issuer: "Technological University of the Philippines, Manila",
    year: "2026",
    detail: "GWA 1.36 · Rank 14 of 2,800+",
    short: "TUP Manila",
    image: "/images/awards/magna-cum-laude.webp",
    imageAlt: "TUP diploma for a BS in Information Systems, Magna Cum Laude, with the university medal",
  },
  {
    title: "DOST-SEI Merit Scholar",
    issuer: "Department of Science and Technology – Science Education Institute",
    year: "2022",
    detail: "S&T Undergraduate Scholarship, MERIT program",
    short: "DOST-SEI",
    image: "/images/awards/dost-sei-qualifiers-2022.webp",
    imageAlt: "DOST graphic congratulating the 10,487 qualifiers of the 2022 DOST-SEI S&T Undergraduate Scholarships",
    document: true,
  },
];
