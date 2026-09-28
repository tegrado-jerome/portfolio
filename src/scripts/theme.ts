// Dark (default) and Light. The initial theme is applied by an inline script in Layout.astro
// before first paint; this module handles changes after load.

export const themes = ["dark", "light"] as const;
export type Theme = (typeof themes)[number];

const root = document.documentElement;

export function currentTheme(): Theme {
  return themes.find((t) => t === root.dataset.theme) ?? "dark";
}

export function nextTheme(): Theme {
  return themes[(themes.indexOf(currentTheme()) + 1) % themes.length];
}

export function setTheme(theme: Theme) {
  if (theme === "dark") delete root.dataset.theme;
  else root.dataset.theme = theme;

  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Storage blocked (private mode) — the theme still applies for this visit.
  }

  const paper = getComputedStyle(root).getPropertyValue("--color-paper").trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", paper);
  document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}
