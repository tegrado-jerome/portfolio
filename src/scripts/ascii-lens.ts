// Cursor-following ASCII lens: characters appear in a soft circle around the pointer,
// picked by the brightness of the image underneath.

const RAMP = " .:-=+*#%@";

interface LensOptions {
  /** Glyph cell size in CSS px. */
  cell: number;
  /** Lens radius in CSS px. */
  radius: number;
  /** Peak glyph opacity at the lens centre. */
  alpha: number;
  /** Image to sample. */
  image: HTMLImageElement;
  className?: string;
  /** Without a mouse, drift the lens across the image on its own while it's on screen. */
  autoplay?: boolean;
}

/** Only truly weak devices (2 or fewer cores, or 2 GB RAM or less) skip the drift; most phones report 4-8. */
function isLowEnd() {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return (navigator.hardwareConcurrency || 8) <= 2 || (memory !== undefined && memory <= 2);
}

export function asciiLens(host: HTMLElement, { cell, radius, alpha, image, className = "", autoplay = false }: LensOptions) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const mouse = matchMedia("(hover: hover) and (pointer: fine)");
  if (!mouse.matches && !autoplay) return;

  const canvas = document.createElement("canvas");
  canvas.className = `ascii-lens ${className}`;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  let W = 0, H = 0, cols = 0, rows = 0;
  let bright: Float32Array | null = null;
  let ready = false;
  let mx = -1, my = -1, raf = 0;

  function sampleImage(img: HTMLImageElement) {
    const off = document.createElement("canvas");
    const octx = off.getContext("2d", { willReadFrequently: true })!;
    off.width = cols;
    off.height = rows;
    const s = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    octx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
    const d = octx.getImageData(0, 0, cols, rows).data;
    const out = new Float32Array(cols * rows);
    for (let i = 0; i < out.length; i++) out[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
    return out;
  }

  function build() {
    const rect = host.getBoundingClientRect();
    W = Math.round(rect.width);
    H = Math.round(rect.height);
    if (!W || !H) return false;
    if (!(image.complete && image.naturalWidth)) return false;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `bold ${cell}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
    ctx.textBaseline = "top";

    cols = Math.ceil(W / cell);
    rows = Math.ceil(H / cell);
    try {
      bright = sampleImage(image);
    } catch {
      bright = null;
    }
    return true;
  }

  function draw(peak = alpha) {
    raf = 0;
    if (!bright) return;
    ctx.clearRect(0, 0, W, H);
    if (mx < 0) return;
    const c0 = Math.max(0, Math.floor((mx - radius) / cell)), c1 = Math.min(cols - 1, Math.ceil((mx + radius) / cell));
    const r0 = Math.max(0, Math.floor((my - radius) / cell)), r1 = Math.min(rows - 1, Math.ceil((my + radius) / cell));
    for (let ry = r0; ry <= r1; ry++) {
      for (let cx = c0; cx <= c1; cx++) {
        const px = cx * cell, py = ry * cell;
        const dist = Math.hypot(px + cell / 2 - mx, py + cell / 2 - my);
        if (dist > radius) continue;
        const ch = RAMP[Math.floor(((255 - bright[ry * cols + cx]) / 255) * (RAMP.length - 1))];
        if (ch === " ") continue;
        ctx.fillStyle = `rgba(255,255,255,${((1 - dist / radius) * peak).toFixed(3)})`;
        ctx.fillText(ch, px, py);
      }
    }
  }

  // Rebuilt only when the picture's own size changes: phones fire window resizes all through a scroll as the address
  // bar slides, and rebuilding (a new canvas and a pixel read-back) on each would stutter the scroll.
  new ResizeObserver(() => (ready = false)).observe(host);
  image.addEventListener("load", () => (ready = false));

  if (autoplay && !isLowEnd()) {
    // Checked live, so switching between mouse and touch (e.g. DevTools device mode) needs no reload.
    let visible = false, drifting = false, t0 = -1, lastDraw = 0;
    const drift = (t: number) => {
      if (!visible || mouse.matches) {
        drifting = false;
        return;
      }
      if (!ready) ready = build();
      // 30 frames a second is plenty for a slow drift and halves the work on phones.
      if (ready && t - lastDraw >= 33) {
        lastDraw = t;
        if (t0 < 0) t0 = t;
        const s = (t - t0) / 1000;
        // starts at the bottom centre, then wanders; fainter than the hover lens so it stays in the background
        mx = W * (0.5 + 0.32 * Math.sin(s * 0.7));
        my = H * (0.45 + 0.3 * Math.cos(s * 1.1));
        draw(alpha * 0.45);
      }
      requestAnimationFrame(drift);
    };
    const start = () => {
      if (drifting) return;
      drifting = true;
      requestAnimationFrame(drift);
    };
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    }).observe(host);
    mouse.addEventListener("change", () => {
      mx = -1;
      ready = false;
      if (W && H) ctx.clearRect(0, 0, W, H);
      start();
    });
  }

  host.addEventListener("pointermove", (e) => {
    if (!mouse.matches) return;
    if (!ready) ready = build();
    if (!ready) return;
    const rect = host.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
    if (!raf) raf = requestAnimationFrame(() => draw());
  });
  host.addEventListener("pointerleave", () => {
    if (!mouse.matches) return;
    mx = -1;
    if (W && H) ctx.clearRect(0, 0, W, H);
  });
}
