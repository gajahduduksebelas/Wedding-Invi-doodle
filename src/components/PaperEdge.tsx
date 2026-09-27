import React from 'react';

// Deterministic "random" so the torn edge is the same on every render.
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const WIDTH = 400;
const HEIGHT = 26;

const tornPath = (() => {
  const rnd = seeded(7);
  const points: string[] = [];
  let x = 0;
  while (x < WIDTH) {
    points.push(`L${x.toFixed(1)} ${(2 + rnd() * 6).toFixed(1)}`);
    x += 10 + rnd() * 12;
  }
  points.push(`L${WIDTH} ${(2 + rnd() * 6).toFixed(1)}`);
  return `M0 ${HEIGHT} ${points.join(' ')} L${WIDTH} ${HEIGHT} Z`;
})();

/**
 * Torn-paper edge laid across the bottom of a photo so the content below reads
 * as a new sheet on top of it (design system: Divider, "torn edge").
 */
export const TornPaperEdge: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#FAF7EE',
}) => (
  <svg
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    preserveAspectRatio="none"
    className={`block w-full h-[26px] ${className}`}
    aria-hidden="true"
  >
    <path d={tornPath} fill={color} stroke="rgba(24,24,24,0.18)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
  </svg>
);
