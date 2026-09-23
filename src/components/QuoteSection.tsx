import React from 'react';
import { DOODLE_ASSETS } from '../data/weddingData';
import { Sparkles, Heart } from 'lucide-react';

export const QuoteSection: React.FC = () => {
  return (
    <section
      id="quote"
      className="min-h-dvh w-full px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Random Floating Doodle Assets */}
      <img
        src={DOODLE_ASSETS.bouquet}
        alt=""
        aria-hidden="true"
        className="absolute top-5 left-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-bob z-10"
      />
      <img
        src={DOODLE_ASSETS.heartArrow}
        alt=""
        aria-hidden="true"
        className="absolute top-5 right-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-float z-10"
      />
      <img
        src={DOODLE_ASSETS.envelopes}
        alt=""
        aria-hidden="true"
        className="absolute bottom-6 right-4 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-80 animate-doodle-slow z-10"
      />

      <div className="absolute top-1/3 left-6 text-[#8b965f]/50 pointer-events-none animate-doodle-pulse">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="absolute bottom-1/3 right-6 text-[#cc3a63]/40 pointer-events-none animate-doodle-pulse">
        <Heart className="w-4 h-4 fill-current" />
      </div>

      {/* Central Borderless Paper Card */}
      <div className="w-full max-w-[400px] rounded-3xl bg-white/95 p-6 sm:p-8 shadow-[0_12px_40px_rgba(74,66,56,0.08)] text-center relative z-20 flex flex-col items-center my-auto">
        {/* Washi Tape Sage */}
        <div
          className="absolute -top-3 w-28 h-6 cd-tape-sage -rotate-1 rounded-xs shadow-xs pointer-events-none"
          aria-hidden="true"
        />

        {/* Doodle Rings Centerpiece */}
        <img
          src={DOODLE_ASSETS.rings}
          alt=""
          aria-hidden="true"
          className="w-16 h-16 object-contain mb-1 mt-1 animate-doodle-float"
        />

        {/* Header Sage */}
        <header className="cd-heading cd-heading-sage mb-3">
          <span>Dengan cinta</span>
          <h2>WITH LOVE</h2>
          <i aria-hidden="true" />
        </header>

        <blockquote className="text-[13.5px] text-[#2b2620] leading-relaxed italic font-medium font-sans">
          “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.”
        </blockquote>

        <p className="mt-4 text-[12.5px] font-bold text-[#8b965f] tracking-wide">
          (Qs. Ar-Rum : 21)
        </p>
      </div>
    </section>
  );
};
