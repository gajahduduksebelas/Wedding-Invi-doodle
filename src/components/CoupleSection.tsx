import React from 'react';
import { COUPLE_DATA } from '../data/weddingData';
import { CoupleData, CouplePerson } from '../types';
import { DoodleBotanicalBranch, SectionHeading } from './DoodleIcons';
import { Camera, Heart } from 'lucide-react';
import { DoodleScatter } from './DoodleScatter';

interface CoupleSectionProps {
  couple?: CoupleData;
}

interface PersonCardProps {
  person: CouplePerson;
  tag: string;
  tapeClass: string;
}

// One mempelai card with a 4:5 portrait (the CMS cropper exports the same ratio).
const PersonCard: React.FC<PersonCardProps> = ({ person, tag, tapeClass }) => {
  const instagram = person.instagram.replace('@', '');
  return (
    <article className="w-full doodle-card p-4 sm:p-5 flex flex-col items-center text-center relative">
      {/* Portrait Frame with Washi Tape */}
      <div className="relative w-full max-w-[236px] sm:max-w-[260px] aspect-[4/5] rounded-[18px] border-[2px] border-[#181818] overflow-hidden mb-3 bg-[#FAF7EE] shadow-xs">
        <div
          className={`absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-4.5 ${tapeClass} rounded-xs z-10 pointer-events-none`}
          aria-hidden="true"
        />
        <img src={person.image} alt={person.name} className="w-full h-full object-cover" loading="lazy" />
      </div>

      {/* Pill Tag */}
      <div className="px-3.5 py-0.5 rounded-full bg-white border-[1.5px] border-[#181818] shadow-2xs text-[10.5px] font-bold tracking-wider uppercase text-[#181818] mb-1">
        {tag}
      </div>

      <h3 className="font-serif text-[19px] sm:text-[21px] font-bold text-[#181818] leading-tight">
        {person.name}
      </h3>

      {/* Parents */}
      <p className="text-[12px] text-stone-600 mt-1 max-w-[290px] leading-relaxed">{person.role}</p>

      {instagram && (
        <a
          href={`https://instagram.com/${instagram}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border-[1.5px] border-[#181818] shadow-[2px_2px_0px_#181818] text-[#181818] text-[11px] font-bold hover:bg-[#FAF7EE] active:translate-y-0.5 transition-all"
        >
          <Camera className="w-3 h-3 text-[#181818]" />
          <span>@{instagram}</span>
        </a>
      )}
    </article>
  );
};

// The groom and the bride each get a full-screen snap section so their
// portraits can be shown large.
export const CoupleSection: React.FC<CoupleSectionProps> = ({ couple }) => {
  const activeCouple = couple || COUPLE_DATA;

  return (
    <>
      <section
        id="mempelai"
        aria-label="Mempelai Pria"
        className="mobile-snap-section w-full px-4 py-8 flex flex-col items-center justify-center relative isolate overflow-hidden select-none"
      >
        <DoodleScatter seed="mempelai" prefer={['suit', 'mensShoes', 'diamondRing']} />

        {/* Decorative Botanical Branch on Left Margin */}
        <div className="absolute top-[18%] -left-1 sm:left-2 z-10 pointer-events-none opacity-85">
          <DoodleBotanicalBranch className="w-10 sm:w-12 h-auto" />
        </div>

        <div className="w-full max-w-[400px] flex flex-col items-center relative z-20 my-auto animate-doodle-in">
          <SectionHeading
            subheadline="Dengan rahmat Allah SWT"
            headline="BRIDE & GROOM"
            subheadlineColor="#B4533C"
            headlineColor="#181818"
            underlineColor="#B4533C"
            className="mb-1.5"
          />

          <p className="text-[12px] text-stone-700 text-center max-w-[340px] leading-relaxed mb-4 font-normal">
            Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk menghadiri acara pernikahan kami.
          </p>

          <PersonCard person={activeCouple.groom} tag="The Groom 🌿" tapeClass="cd-tape-pink -rotate-1" />
        </div>
      </section>

      <section
        id="mempelai-wanita"
        aria-label="Mempelai Wanita"
        className="mobile-snap-section w-full px-4 py-8 flex flex-col items-center justify-center relative isolate overflow-hidden select-none"
      >
        <DoodleScatter seed="mempelai-wanita" prefer={['weddingDress', 'heels', 'rose']} />

        <div className="absolute top-[18%] -right-1 sm:right-2 z-10 pointer-events-none opacity-85 -scale-x-100">
          <DoodleBotanicalBranch className="w-10 sm:w-12 h-auto" />
        </div>

        <div className="w-full max-w-[400px] flex flex-col items-center relative z-20 my-auto animate-doodle-in">
          {/* Romantic Ampersand & Heart Connector */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE3C6] border-[1.5px] border-[#181818] shadow-[2px_2px_0px_#181818]">
              <span className="font-delicious text-xl text-[#B4533C] font-bold leading-none">&amp;</span>
              <Heart className="w-3.5 h-3.5 fill-[#B4533C] text-[#B4533C]" />
            </div>
          </div>

          <PersonCard person={activeCouple.bride} tag="The Bride 🌸" tapeClass="cd-tape-sage rotate-1" />
        </div>
      </section>
    </>
  );
};
