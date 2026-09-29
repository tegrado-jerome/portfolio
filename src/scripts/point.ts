// Scrolls the page to a section ("projects") or a single card ("awards/magna-cum-laude", its ~/path) and gives a
// card a short highlight. Used by the chat's [[show:…]] replies and the hero prompt's `cd`.

export function findTarget(target: string) {
  if (target === "top" || target === "~") return document.getElementById("top");
  if (!target.includes("/")) return document.getElementById(target);
  return document.querySelector(`template[data-path="${CSS.escape(target)}"]`)?.closest<HTMLElement>(".card") ?? null;
}

export function pointTo(target: string) {
  const el = findTarget(target);
  if (!el) return false;
  const card = target.includes("/");
  const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: card ? "center" : "start" });
  if (card) {
    el.classList.remove("is-pointed");
    void el.offsetWidth; // restart the highlight if it's already running
    el.classList.add("is-pointed");
    el.addEventListener("animationend", () => el.classList.remove("is-pointed"), { once: true });
  }
  return true;
}
