// Small UI sounds (after joshwcomeau.com), off until the visitor turns them on in the status bar.
// Made with Web Audio, so there are no files to load: a soft key click, a two-note send blip and a chime.

const KEY = "sound";
let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let enabled = soundOn();

export function soundOn() {
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

export function setSound(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    // Storage blocked: the switch still works for this page view.
  }
  enabled = on;
}

function tone(c: AudioContext, freq: number, start: number, length: number, volume: number) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + length);
}

export function play(kind: "key" | "send" | "point") {
  if (!enabled) return;
  ctx ??= new AudioContext();
  const c = ctx;
  const t = c.currentTime;
  if (kind === "key") {
    // A short burst of filtered noise, a little different each time, like a real key.
    noise ??= (() => {
      const buffer = c.createBuffer(1, c.sampleRate * 0.03, c.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3;
      return buffer;
    })();
    const src = c.createBufferSource();
    const filter = c.createBiquadFilter();
    const gain = c.createGain();
    src.buffer = noise;
    filter.type = "bandpass";
    filter.frequency.value = 1800 + Math.random() * 900;
    gain.gain.value = 0.18;
    src.connect(filter).connect(gain).connect(c.destination);
    src.start(t);
  } else if (kind === "send") {
    tone(c, 660, t, 0.08, 0.05);
    tone(c, 990, t + 0.06, 0.12, 0.05);
  } else {
    tone(c, 880, t, 0.6, 0.04);
    tone(c, 1320, t + 0.02, 0.45, 0.02);
  }
}
