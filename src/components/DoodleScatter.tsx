import React, { useLayoutEffect, useRef, useState } from 'react';

/** Hand-drawn doodle stickers from the Wedding Doodle pack (public/assets/doodles). */
const DOODLE = {
  wineGlasses: '/assets/doodles/wine-glasses.webp',
  weddingBells: '/assets/doodles/wedding-bells.webp',
  envelopes: '/assets/doodles/envelopes.webp',
  doves: '/assets/doodles/doves.webp',
  heartBalloons: '/assets/doodles/heart-balloons.webp',
  rose: '/assets/doodles/rose.webp',
  ringBox: '/assets/doodles/ring-box.webp',
  diamondRing: '/assets/doodles/diamond-ring.webp',
  suit: '/assets/doodles/suit.webp',
  weddingDress: '/assets/doodles/wedding-dress.webp',
  calendar: '/assets/doodles/calendar.webp',
  heartLollipops: '/assets/doodles/heart-lollipops.webp',
  roseBouquet: '/assets/doodles/rose-bouquet.webp',
  weddingCake: '/assets/doodles/wedding-cake.webp',
  mensShoes: '/assets/doodles/mens-shoes.webp',
  heels: '/assets/doodles/heels.webp',
  holdingHands: '/assets/doodles/holding-hands.webp',
  giftBox: '/assets/doodles/gift-box.webp',
  heartArrow: '/assets/doodles/heart-arrow.webp',
  loveLetter: '/assets/doodles/love-letter.webp',
} as const;

export type DoodleKey = keyof typeof DOODLE;

// Width / height of each trimmed asset, so a doodle's footprint is known before it loads.
const ASPECT: Record<DoodleKey, number> = {
  wineGlasses: 0.99, weddingBells: 1.12, envelopes: 1.22, doves: 2.22, heartBalloons: 0.65,
  rose: 0.61, ringBox: 0.91, diamondRing: 0.93, suit: 1.23, weddingDress: 1.33,
  calendar: 1.0, heartLollipops: 0.77, roseBouquet: 0.84, weddingCake: 0.8, mensShoes: 0.86,
  heels: 0.95, holdingHands: 0.97, giftBox: 1.35, heartArrow: 0.93, loveLetter: 0.94,
};

const ICONS = Object.keys(DOODLE) as DoodleKey[];

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

// mulberry32 — tiny deterministic PRNG so every guest sees the same layout.
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

interface Box { x: number; y: number; w: number; h: number }

interface Placed {
  key: DoodleKey;
  x: number;
  y: number;
  w: number;
  rot: number;
  float: boolean;
}

const overlap = (a: Box, b: Box) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

const isOpaque = (color: string) => {
  if (!color || color === 'transparent') return false;
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (!m) return false;
  const parts = m[1].split(/[\s,/]+/).filter(Boolean);
  return parts.length < 4 || parseFloat(parts[3]) > 0.6;
};

// Height of the fixed bottom nav (plus a little air) that covers each screen's bottom.
const BOTTOM_RESERVE = 76;

const CONTENT = 'h1,h2,h3,h4,p,span,blockquote,img,video,iframe,svg,button,a,input,textarea,select,label,li';

/**
 * Measures what's on screen inside `section`:
 *  - `solid`: boxes with an opaque background or border (cards, pills, photos).
 *    Doodles may tuck partly behind these.
 *  - `bare`: text and media that sit directly on the page. Doodles never touch these.
 */
const measure = (section: HTMLElement, layer: HTMLElement) => {
  const origin = section.getBoundingClientRect();
  const solid: Box[] = [];
  const bare: Box[] = [];
  const toBox = (r: DOMRect): Box => ({ x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height });
  const solidEls = new Set<Element>();

  section.querySelectorAll<HTMLElement>('*').forEach((el) => {
    if (layer.contains(el) || el.closest('[data-doodle-ignore]')) return;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) return;
    const bordered = parseFloat(cs.borderTopWidth) >= 1 && parseFloat(cs.borderLeftWidth) >= 1;
    if (isOpaque(cs.backgroundColor) || bordered || /^(IMG|VIDEO|IFRAME)$/.test(el.tagName)) {
      solidEls.add(el);
      solid.push(toBox(r));
    }
  });

  section.querySelectorAll<HTMLElement>(CONTENT).forEach((el) => {
    if (layer.contains(el) || el.closest('[data-doodle-ignore]')) return;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    // Anything that sits inside a card is already covered by that card — but a
    // hand-placed doodle hanging over the card's edge still needs clearing.
    for (let p = el.parentElement; p && p !== section; p = p.parentElement) {
      if (!solidEls.has(p)) continue;
      const c = p.getBoundingClientRect();
      if (r.left >= c.left - 1 && r.right <= c.right + 1 && r.top >= c.top - 1 && r.bottom <= c.bottom + 1) return;
    }
    bare.push(toBox(r));
  });

  return { width: section.clientWidth, height: section.scrollHeight, solid, bare };
};

const layout = (
  seed: string,
  { width, height, solid, bare }: ReturnType<typeof measure>,
  prefer: DoodleKey[],
): Placed[] => {
  const rand = rng(hash(seed));
  const between = (a: number, b: number) => a + (b - a) * rand();

  // Preferred doodles first, then the rest of the pack in a seeded shuffle.
  const rest = ICONS.filter((k) => !prefer.includes(k));
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  const queue = [...prefer, ...rest];

  // Roughly one doodle per ~55k px² (≈5 on a phone screen) — the sections keep
  // their own hand-placed doodles too, so the scatter stays light.
  const target = Math.max(3, Math.min(10, Math.round((Math.min(width, 520) * height) / 55000)));
  const placed: Placed[] = [];
  const boxes: Box[] = [];
  const pad = 6;

  const fits = (b: Box, spacing: number) => {
    const inflated = { x: b.x - pad, y: b.y - pad, w: b.w + pad * 2, h: b.h + pad * 2 };
    if (bare.some((o) => overlap(inflated, o) > 0)) return false;
    // At most ~30% of a doodle may hide behind cards.
    const hidden = solid.reduce((sum, o) => sum + overlap(b, o), 0);
    if (hidden > b.w * b.h * 0.3) return false;
    // Keep breathing room between doodles so the page doesn't look busy.
    const cx = b.x + b.w / 2;
    const cy = b.y + b.h / 2;
    return boxes.every((o) => {
      const dx = cx - (o.x + o.w / 2);
      const dy = cy - (o.y + o.h / 2);
      return Math.hypot(dx, dy) > (Math.max(b.w, b.h) + Math.max(o.w, o.h)) / 2 + spacing;
    });
  };

  const tryPlace = (key: DoodleKey, minW: number, maxW: number, attempts: number) => {
    for (let a = 0; a < attempts; a++) {
      // Shrink a little as we run out of room.
      const w = between(minW, maxW) * (1 - (a / attempts) * 0.3);
      const h = w / ASPECT[key];
      // Allow a slight bleed past the section edges, like a sticker hanging off the page.
      const x = between(-w * 0.3, width - w * 0.7);
      // Keep clear of the fixed bottom navigation bar.
      const y = between(8, height - h - BOTTOM_RESERVE);
      const box = { x, y, w, h };
      if (fits(box, 38)) {
        placed.push({ key, x, y, w, rot: between(-18, 18), float: false });
        boxes.push(box);
        return true;
      }
    }
    return false;
  };

  for (const key of queue) {
    if (placed.length >= target) break;
    tryPlace(key, 40, 62, 50);
  }

  // One gentle mover per section at most.
  if (placed.length) placed[Math.floor(rand() * placed.length)].float = true;
  return placed;
};

interface DoodleScatterProps {
  /** Stable seed — usually the section id. */
  seed: string;
  /** Doodles to use first for this section (theme-relevant). */
  prefer?: DoodleKey[];
}

/**
 * Scatters doodles over the free space of its parent section: random positions,
 * sizes and tilt (seeded, so stable across visits), never over text, and at most
 * slightly tucked behind cards. The parent must be `relative isolate`.
 */
export const DoodleScatter: React.FC<DoodleScatterProps> = ({ seed, prefer = [] }) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Placed[]>([]);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    const section = layer?.parentElement;
    if (!layer || !section) return;

    let frame = 0;
    let lastKey = '';
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // The keyboard is up on the RSVP form — leave everything where it is.
        if (section.closest('.is-typing')) return;
        const m = measure(section, layer);
        if (!m.width || !m.height) return;
        const key = [m.width, m.height, ...m.bare.map((b) => `${b.x | 0},${b.y | 0}`)].join('|');
        if (key === lastKey) return;
        lastKey = key;
        setItems(layout(seed, m, prefer));
      });
    };

    run();
    const ro = new ResizeObserver(run);
    ro.observe(section);
    Array.from(section.children).forEach((c) => c !== layer && ro.observe(c));
    // Photos and fonts shift content around once they load.
    section.addEventListener('load', run, true);
    document.fonts?.ready.then(run);
    // Sections pop in with a short transform animation; measure again once it settles.
    const settle = window.setTimeout(run, 900);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      ro.disconnect();
      section.removeEventListener('load', run, true);
    };
    // prefer is a literal per call site; the seed identifies the configuration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  return (
    <div ref={layerRef} className="doodle-scatter absolute inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      {items.map((d, i) => (
        <div
          key={`${d.key}-${i}`}
          className="absolute"
          style={{ left: d.x, top: d.y, width: d.w, transform: `rotate(${d.rot.toFixed(1)}deg)` }}
        >
          <img
            src={DOODLE[d.key]}
            alt=""
            draggable={false}
            decoding="async"
            className={`block w-full h-auto doodle-scatter-item ${d.float ? 'animate-doodle-float' : ''}`}
          />
        </div>
      ))}
    </div>
  );
};
