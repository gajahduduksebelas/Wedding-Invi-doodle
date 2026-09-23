import React from 'react';
import { COUPLE_DATA, DOODLE_ASSETS } from '../data/weddingData';
import { CoupleData } from '../types';
import { Sparkles, Heart } from 'lucide-react';

interface CoupleSectionProps {
  couple?: CoupleData;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ couple }) => {
  const activeCouple = couple || COUPLE_DATA;

  return (
    <section
      id="mempelai"
      className="min-h-dvh w-full px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Random Floating Doodle Assets */}
      <img
        src={DOODLE_ASSETS.loveBirds}
        alt=""
        aria-hidden="true"
        className="absolute top-4 left-2 w-16 sm:w-20 h-16 sm:h-20 object-contain pointer-events-none opacity-85 animate-doodle-float z-10"
      />
      <img
        src={DOODLE_ASSETS.heartBalloons}
        alt=""
        aria-hidden="true"
        className="absolute top-5 right-2 w-16 sm:w-20 h-16 sm:h-20 object-contain pointer-events-none opacity-85 animate-doodle-slow z-10"
      />
      <img
        src={DOODLE_ASSETS.rings}
        alt=""
        aria-hidden="true"
        className="absolute bottom-5 left-3 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-sway z-10"
      />
      <img
        src={DOODLE_ASSETS.bouquet}
        alt=""
        aria-hidden="true"
        className="absolute bottom-5 right-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-bob z-10"
      />

      <div className="absolute top-1/2 left-4 text-[#cc3a63]/30 pointer-events-none animate-doodle-pulse">
        <Heart className="w-4 h-4 fill-current" />
      </div>
      <div className="absolute top-1/2 right-4 text-[#8b965f]/40 pointer-events-none animate-doodle-pulse">
        <Sparkles className="w-5 h-5" />
      </div>

      <div className="w-full max-w-[420px] flex flex-col items-center relative z-20 my-auto">
        {/* Floral Banner Top Doodle */}
        <img
          src={DOODLE_ASSETS.floralBanner}
          alt=""
          aria-hidden="true"
          className="w-44 sm:w-52 h-auto object-contain mb-1 animate-doodle-float"
        />

        {/* Heading Coral */}
        <header className="cd-heading cd-heading-coral mb-2">
          <span>Dengan rahmat Allah SWT</span>
          <h2>BRIDE &amp; GROOM</h2>
          <i aria-hidden="true" />
        </header>

        <p className="text-[12.5px] sm:text-[13px] text-[#524348] text-center max-w-[360px] leading-relaxed mb-5 font-sans">
          Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk menghadiri acara pernikahan kami.
        </p>

        {/* Polaroids Party Grid (Border-Free Clean Paper Cards) */}
        <div className="w-full flex flex-col gap-5">
          {/* GROOM POLAROID (Tilted Left, Pink Tape) */}
          <article className="relative rounded-3xl bg-white/95 p-5 sm:p-6 shadow-[0_10px_35px_rgba(74,66,56,0.08)] -rotate-1 hover:rotate-0 transition-transform flex flex-col items-center text-center">
            {/* Top Washi Tape Pink */}
            <div
              className="absolute -top-3 w-28 h-6 cd-tape-pink -rotate-2 rounded-xs shadow-xs"
              aria-hidden="true"
            />

            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-sm mb-3 bg-[#f9f0e0]">
              <img
                src={activeCouple.groom.image}
                alt={activeCouple.groom.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <span className="px-3 py-0.5 rounded-full bg-[#f0f3e3] text-[#51582f] text-[11.5px] font-bold mb-1.5 shadow-xs">
              The Groom 🌿
            </span>

            <h3 className="text-[20px] sm:text-[22px] font-bold text-[#2b2620] font-heading">
              {activeCouple.groom.name}
            </h3>

            <p className="text-[12.5px] text-[#524348] mt-1 max-w-[280px] leading-relaxed">
              {activeCouple.groom.role}
            </p>

            <a
              href={`https://instagram.com/${activeCouple.groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f9f0e0] text-[#2b2620] text-[12px] font-bold shadow-xs hover:bg-[#edd9bf] active:translate-y-0.5 transition-all"
            >
              <span>📷 @{activeCouple.groom.instagram.replace('@', '')}</span>
            </a>
          </article>

          {/* BRIDE POLAROID (Tilted Right, Sage Tape) */}
          <article className="relative rounded-3xl bg-white/95 p-5 sm:p-6 shadow-[0_10px_35px_rgba(74,66,56,0.08)] rotate-1 hover:rotate-0 transition-transform flex flex-col items-center text-center">
            {/* Top Washi Tape Sage */}
            <div
              className="absolute -top-3 w-28 h-6 cd-tape-sage rotate-2 rounded-xs shadow-xs"
              aria-hidden="true"
            />

            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-sm mb-3 bg-[#f9f0e0]">
              <img
                src={activeCouple.bride.image}
                alt={activeCouple.bride.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <span className="px-3 py-0.5 rounded-full bg-[#fcecf0] text-[#cc3a63] text-[11.5px] font-bold mb-1.5 shadow-xs">
              The Bride 🌸
            </span>

            <h3 className="text-[20px] sm:text-[22px] font-bold text-[#2b2620] font-heading">
              {activeCouple.bride.name}
            </h3>

            <p className="text-[12.5px] text-[#524348] mt-1 max-w-[280px] leading-relaxed">
              {activeCouple.bride.role}
            </p>

            <a
              href={`https://instagram.com/${activeCouple.bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f9f0e0] text-[#2b2620] text-[12px] font-bold shadow-xs hover:bg-[#edd9bf] active:translate-y-0.5 transition-all"
            >
              <span>📷 @{activeCouple.bride.instagram.replace('@', '')}</span>
            </a>
          </article>
        </div>
      </div>
    </section>
  );
};
