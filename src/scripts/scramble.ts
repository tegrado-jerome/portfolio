// "Decode" text effect (as on Vercel, Linear and Warp's sites): each character flickers through random glyphs
// and settles left to right. Runs once per [data-scramble] element when it first scrolls into view,
// after the preloader. Only text nodes change, so nested markup (colours, icons) stays intact.

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";
const DURATION = 700; // ms for the whole element to settle
const SPREAD = 0.55; // share of the duration over which characters start settling, left to right

function scramble(el: HTMLElement) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: { node: Text; text: string; offset: number }[] = [];
  let total = 0;
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (!node.textContent?.trim()) continue;
    nodes.push({ node, text: node.textContent, offset: total });
    total += node.textContent.length;
  }
  if (!total) return;

  const start = performance.now();
  const frame = (now: number) => {
    const t = (now - start) / DURATION;
    for (const { node, text, offset } of nodes) {
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const settleAt = ((offset + i) / total) * SPREAD + (1 - SPREAD) * 0.4;
        const ch = text[i];
        out += ch === " " || t >= settleAt ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      node.textContent = out;
    }
    if (t < 1) requestAnimationFrame(frame);
    else nodes.forEach(({ node, text }) => (node.textContent = text));
  };
  requestAnimationFrame(frame);
}

export function initScramble() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        scramble(entry.target as HTMLElement);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  const start = () => document.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => io.observe(el));
  if (document.documentElement.classList.contains("is-preloading")) {
    document.addEventListener("preloader:done", start, { once: true });
  } else {
    start();
  }
}
