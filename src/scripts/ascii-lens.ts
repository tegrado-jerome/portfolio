// Cursor-following ASCII lens: characters appear in a soft circle around the pointer,
// picked by the brightness of whatever is underneath (an image, or a generated field).

const RAMP = " .:-=+*#%@";

interface LensOptions {
  /** Glyph cell size in CSS px. */
  cell: number;
  /** Lens radius in CSS px. */
  radius: number;
  /** Peak glyph opacity at the lens centre. */
  alpha: number;
  /** Image to sample. When omitted, a smooth generated pattern is used. */
  image?: HTMLImageElement | null;
  className?: string;
}

export function asciiLens(host: HTMLElement, { cell, radius, alpha, image, className = "" }: LensOptions) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

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

  function sampleField() {
    const out = new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        const v = Math.sin(x * 0.21 + Math.cos(y * 0.13) * 2) * Math.cos(y * 0.17 - x * 0.05) + Math.sin((x + y) * 0.07);
        out[y * cols + x] = 128 + v * 60;
      }
    return out;
  }

  function build() {
    const rect = host.getBoundingClientRect();
    W = Math.round(rect.width);
    H = Math.round(rect.height);
    if (!W || !H) return false;
    if (image && !(image.complete && image.naturalWidth)) return false;

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
      bright = image ? sampleImage(image) : sampleField();
    } catch {
      bright = null;
    }
    return true;
  }

  function draw() {
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
        ctx.fillStyle = `rgba(255,255,255,${((1 - dist / radius) * alpha).toFixed(3)})`;
        ctx.fillText(ch, px, py);
      }
    }
  }

  host.addEventListener("pointermove", (e) => {
    if (!ready) ready = build();
    if (!ready) return;
    const rect = host.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
    if (!raf) raf = requestAnimationFrame(draw);
  });
  host.addEventListener("pointerleave", () => {
    mx = -1;
    if (W && H) ctx.clearRect(0, 0, W, H);
  });
  window.addEventListener("resize", () => (ready = false));
  image?.addEventListener("load", () => (ready = false));
}
