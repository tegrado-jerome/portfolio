// URL-style name for a card or section, e.g. "Magna Cum Laude" → "magna-cum-laude". The detail modal's ~/path and
// the chat's [[show:…]] targets both use it, so they always agree.
export const slug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
