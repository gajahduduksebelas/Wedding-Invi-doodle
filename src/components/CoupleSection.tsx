import React from 'react';
import { COUPLE_DATA } from '../data/weddingData';
import { CoupleData } from '../types';
import { DoodleBotanicalBranch, SectionHeading } from './DoodleIcons';
import { Camera } from 'lucide-react';

interface CoupleSectionProps {
  couple?: CoupleData;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ couple }) => {
  const activeCouple = couple || COUPLE_DATA;

  return (
    <section
      id="mempelai"
      aria-label="Profil Mempelai"
      className="w-full px-4 py-10 flex flex-col items-center justify-center relative select-none"
    >
      {/* Decorative Botanical Branch on Left Margin */}
      <div className="absolute top-[32%] -left-1 sm:left-2 z-10 pointer-events-none opacity-85">
        <DoodleBotanicalBranch className="w-10 sm:w-12 h-auto" />
      </div>

      <div className="w-full max-w-[400px] flex flex-col items-center relative z-20">
        <SectionHeading
          subheadline="Dengan rahmat Allah SWT"
          headline="BRIDE & GROOM"
          subheadlineColor="#B4533C"
          headlineColor="#181818"
          underlineColor="#B4533C"
          className="mb-3"
        />

        <p className="text-[13px] text-stone-700 text-center max-w-[340px] leading-relaxed mb-6 font-normal">
          Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk menghadiri acara pernikahan kami.
        </p>

        <div className="w-full flex flex-col gap-6">
          {/* GROOM CARD */}
          <article className="w-full doodle-card p-5 sm:p-6 flex flex-col items-center text-center relative">
            {/* Portrait Frame with Washi Tape */}
            <div className="relative w-full max-w-[310px] aspect-[4/5] rounded-[22px] border-[2px] border-[#181818] overflow-hidden mb-4 bg-[#FAF7EE] shadow-xs">
              {/* Peach Washi Tape at Top Center */}
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-28 h-5 cd-tape-pink -rotate-1 rounded-xs z-10 pointer-events-none"
                aria-hidden="true"
              />
              <img
                src={activeCouple.groom.image}
                alt={activeCouple.groom.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Pill Tag */}
            <div className="px-4 py-1 rounded-full bg-white border-[1.5px] border-[#181818] shadow-2xs text-[11px] font-bold tracking-wider uppercase text-[#181818] mb-2">
              The Groom 🌿
            </div>

            {/* Groom Full Name */}
            <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#181818] leading-tight">
              {activeCouple.groom.name}
            </h3>

            {/* Parents */}
            <p className="text-[12.5px] text-stone-600 mt-1 max-w-[290px] leading-relaxed">
              {activeCouple.groom.role}
            </p>

            {/* Instagram Pill Button */}
            <a
              href={`https://instagram.com/${activeCouple.groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border-[1.5px] border-[#181818] shadow-[2.5px_2.5px_0px_#181818] text-[#181818] text-[12px] font-bold hover:bg-[#FAF7EE] active:translate-y-0.5 transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-[#181818]" />
              <span>@{activeCouple.groom.instagram.replace('@', '')}</span>
            </a>
          </article>

          {/* BRIDE CARD */}
          <article className="w-full doodle-card p-5 sm:p-6 flex flex-col items-center text-center relative">
            {/* Portrait Frame with Washi Tape */}
            <div className="relative w-full max-w-[310px] aspect-[4/5] rounded-[22px] border-[2px] border-[#181818] overflow-hidden mb-4 bg-[#FAF7EE] shadow-xs">
              {/* Mint Washi Tape at Top Center */}
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-28 h-5 cd-tape-sage rotate-1 rounded-xs z-10 pointer-events-none"
                aria-hidden="true"
              />
              <img
                src={activeCouple.bride.image}
                alt={activeCouple.bride.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Pill Tag */}
            <div className="px-4 py-1 rounded-full bg-white border-[1.5px] border-[#181818] shadow-2xs text-[11px] font-bold tracking-wider uppercase text-[#181818] mb-2">
              The Bride 🌸
            </div>

            {/* Bride Full Name */}
            <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#181818] leading-tight">
              {activeCouple.bride.name}
            </h3>

            {/* Parents */}
            <p className="text-[12.5px] text-stone-600 mt-1 max-w-[290px] leading-relaxed">
              {activeCouple.bride.role}
            </p>

            {/* Instagram Pill Button */}
            <a
              href={`https://instagram.com/${activeCouple.bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border-[1.5px] border-[#181818] shadow-[2.5px_2.5px_0px_#181818] text-[#181818] text-[12px] font-bold hover:bg-[#FAF7EE] active:translate-y-0.5 transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-[#181818]" />
              <span>@{activeCouple.bride.instagram.replace('@', '')}</span>
            </a>
          </article>
        </div>
      </div>
    </section>
  );
};
