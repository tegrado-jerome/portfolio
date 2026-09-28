// What the site's chat (you, speaking in first person) knows. It answers ONLY
// from these facts plus the public site data (headline, intro, timeline, projects, links) —
// anything still marked [PLACEHOLDER] is skipped, and it says it doesn't know rather than guessing.
// Write one plain fact per line, about yourself. Keep private details (phone, home address) out.

export const assistant = {
  suggestions: ["What do you do?", "What have you worked on?", "How can I contact you?"],
  facts: [
    "Full name: Jerome Brent Tegrado. I go by Jerome.",
    "[YOUR ROLE / WHAT YOU DO]",
    "[WHERE YOU'RE BASED]",
    "[YEARS OF EXPERIENCE AND MAIN SKILLS]",
    "[CURRENT COMPANY OR FREELANCE STATUS]",
    "[WHAT KIND OF WORK OR CLIENTS YOU'RE LOOKING FOR]",
    "I graduated Magna Cum Laude (1.36) from the Technological University of the Philippines (TUP) Manila.",
    "[LINKEDIN PROFILE URL]",
  ],
};
