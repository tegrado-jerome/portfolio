// Scrolls the page to a section ("projects") or a single card ("awards/magna-cum-laude", its ~/path) and gives a
// card a short highlight: accent crop marks, like the hero portrait's, snap onto it and fade.
// Used by the chat's [[show:…]] replies and the hero prompt's `cd`.
import { play } from "./sound";

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
  if (card) frame(el);
  play("point");
  return true;
}

// The marks sit in their own layer over the card (cards clip their overflow). The card can still shift while the
// page scrolls to it (its reveal, images loading above), so the layer follows it every frame until it fades.
function frame(card: HTMLElement) {
  document.querySelector(".point-frame")?.remove();
  const el = document.createElement("div");
  el.className = "point-frame";
  el.setAttribute("aria-hidden", "true");
  el.append(...["tl", "tr", "bl", "br"].map((corner) => Object.assign(document.createElement("span"), { className: corner })));
  document.body.append(el);
  const follow = () => {
    if (!el.isConnected) return;
    const r = card.getBoundingClientRect();
    Object.assign(el.style, {
      top: `${r.top + scrollY}px`,
      left: `${r.left + scrollX}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
    });
    requestAnimationFrame(follow);
  };
  follow();
  el.addEventListener("animationend", (e) => e.target === el && el.remove());
}
