// Light (default) and Dark. The initial theme is applied by an inline script in Layout.astro
// before first paint; this module handles changes after load.

export const themes = ["light", "dark"] as const;
export type Theme = (typeof themes)[number];

const root = document.documentElement;

export function currentTheme(): Theme {
  return themes.find((t) => t === root.dataset.theme) ?? "light";
}

export function nextTheme(): Theme {
  return themes[(themes.indexOf(currentTheme()) + 1) % themes.length];
}

export function setTheme(theme: Theme) {
  // One clean swap: no transitions while the colours change, back on two frames later.
  root.classList.add("theme-switching");
  if (theme === "light") delete root.dataset.theme;
  else root.dataset.theme = theme;
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));

  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Storage blocked (private mode) — the theme still applies for this visit.
  }

  const paper = getComputedStyle(root).getPropertyValue("--color-paper").trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", paper);
  document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}
