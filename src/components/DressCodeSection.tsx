import React from 'react';
import { Heart } from 'lucide-react';
import { DressCodeColor, DressCodeConfig } from '../types';
import { SectionHeading } from './DoodleIcons';

// Hand-drawn clothes hanger in the invitation's doodle style.
const DoodleHanger: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 44" fill="none" className={className} aria-hidden="true">
    <path
      d="M32 13c-4.5 0-5-5.5-1.5-7 3-1.3 6 1 5.2 4.2-.6 2.4-3.7 3.4-3.7 6.3v1.2L6 34.2c-2.7 1.8-1.5 5.3 1.7 5.3h48.6c3.2 0 4.4-3.5 1.7-5.3L33 18"
      stroke="#181818"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 36.5c6-1 30-1 36 0" stroke="#B4533C" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const Swatch: React.FC<{ color: DressCodeColor; index: number; avoid?: boolean }> = ({ color, index, avoid }) => (
  <li className="flex flex-col items-center w-[56px]">
    <span
      className={`relative block rounded-full border-[2px] border-[#181818] shadow-[2.5px_2.5px_0px_#181818] ${
        avoid ? 'w-10 h-10' : 'w-11 h-11'
      }`}
      style={{
        backgroundColor: color.hex,
        // A slight tilt per swatch keeps the row feeling hand-placed.
        transform: `rotate(${[-4, 3, -2, 4, -3][index % 5]}deg)`,
      }}
      title={`${color.name} ${color.hex}`}
    >
      {avoid && (
        <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full" aria-hidden="true">
          <path d="M9 9 L31 31" stroke="#B4533C" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      )}
    </span>
    <span className="mt-2 text-[11px] font-bold text-[#181818] leading-tight text-center">{color.name}</span>
    {!avoid && <span className="text-[9.5px] font-mono text-stone-500 uppercase">{color.hex}</span>}
  </li>
);

/** The card itself; also rendered as the live preview in the CMS editor. */
export const DressCodeCard: React.FC<{ config: DressCodeConfig }> = ({ config }) => {
  const notes = config.notes.filter((n) => n.trim());
  return (
  <article className="w-full doodle-card p-5 sm:p-6 flex flex-col items-center text-center relative">
    {/* Hanger hooked over the card's top edge */}
    <div className="absolute -top-6 right-5 pointer-events-none rotate-6">
      <DoodleHanger className="w-12 h-auto" />
    </div>

    {config.attire && (
      <span className="mt-1 px-4 py-1 rounded-full bg-[#EFE3C6] border-[1.5px] border-[#181818] shadow-[2px_2px_0px_#181818] text-[12px] font-bold text-[#181818] max-w-[85%]">
        {config.attire}
      </span>
    )}

    {config.description && (
      <p className="text-[12.5px] text-stone-700 leading-relaxed mt-3 max-w-[310px]">{config.description}</p>
    )}

    {config.colors.length > 0 && (
      <ul className="mt-4 flex flex-wrap justify-center gap-x-1.5 gap-y-3" aria-label="Palet warna busana">
        {config.colors.map((c, i) => (
          <Swatch key={c.id} color={c} index={i} />
        ))}
      </ul>
    )}

    {config.avoidColors.length > 0 && (
      <div className="mt-4 w-full rounded-2xl bg-[#FAF7EE] border-[1.5px] border-dashed border-[#181818]/40 px-3 py-3">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#B4533C] mb-2">
          Mohon hindari
        </span>
        <ul className="flex flex-wrap justify-center gap-x-2 gap-y-2" aria-label="Warna yang dihindari">
          {config.avoidColors.map((c, i) => (
            <Swatch key={c.id} color={c} index={i} avoid />
          ))}
        </ul>
      </div>
    )}

    {notes.length > 0 && (
      <ul className="mt-4 flex flex-col gap-1.5 text-left w-full max-w-[300px]">
        {notes.map((note, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px] text-stone-700 leading-snug">
            <Heart className="w-3 h-3 mt-[3px] shrink-0 fill-[#B4533C] text-[#B4533C]" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    )}
  </article>
  );
};

export const DressCodeSection: React.FC<{ config: DressCodeConfig }> = ({ config }) => (
  <section
    id="dresscode"
    aria-label="Dress Code"
    className="mobile-snap-section w-full px-4 py-6 flex flex-col items-center justify-center select-none"
  >
    <div className="w-full max-w-[400px] flex flex-col items-center my-auto animate-doodle-in">
      <SectionHeading
        subheadline="Busana yang dianjurkan"
        headline="DRESS CODE"
        subheadlineColor="#B4533C"
        headlineColor="#181818"
        underlineColor="#B4533C"
        className="mb-4"
      />
      <DressCodeCard config={config} />
    </div>
  </section>
);
