import React from 'react';
import { DOODLE_ASSETS } from '../data/weddingData';
import { CoupleData } from '../types';
import { Heart, Sparkles } from 'lucide-react';

interface ClosingSectionProps {
  couple?: CoupleData;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ couple }) => {
  const groomNickname = couple?.groom.nickname || 'Arga';
  const brideNickname = couple?.bride.nickname || 'Kirana';
  const weddingDate = couple?.weddingDate || 'Minggu, 14 Februari 2027';

  return (
    <div className="w-full flex flex-col items-center">
      {/* ============================================================ */}
      {/* 1. CLOSING SECTION (FULL-PAGE MOBILE FRIENDLY)               */}
      {/* ============================================================ */}
      <section
        id="closing"
        className="min-h-dvh w-full px-4 py-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        {/* Floating Random Doodle Assets */}
        <img
          src={DOODLE_ASSETS.loveBirds}
          alt=""
          aria-hidden="true"
          className="absolute top-5 left-3 w-16 sm:w-20 h-16 sm:h-20 object-contain pointer-events-none opacity-85 animate-doodle-float z-10"
        />
        <img
          src={DOODLE_ASSETS.heartBalloons}
          alt=""
          aria-hidden="true"
          className="absolute top-5 right-3 w-16 sm:w-20 h-16 sm:h-20 object-contain pointer-events-none opacity-85 animate-doodle-slow z-10"
        />
        <img
          src={DOODLE_ASSETS.bouquet}
          alt=""
          aria-hidden="true"
          className="absolute bottom-6 left-4 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-bob z-10"
        />
        <img
          src={DOODLE_ASSETS.rings}
          alt=""
          aria-hidden="true"
          className="absolute bottom-6 right-4 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-sway z-10"
        />

        <div className="absolute top-1/2 left-3 text-[#cc3a63]/30 pointer-events-none animate-doodle-pulse">
          <Heart className="w-4 h-4 fill-current" />
        </div>
        <div className="absolute top-1/2 right-3 text-[#8b965f]/40 pointer-events-none animate-doodle-pulse">
          <Sparkles className="w-5 h-5" />
        </div>

        <div className="w-full max-w-[400px] flex flex-col items-center relative z-20 my-auto">
          {/* Closing Illustration Photo (Border-free soft shadow with washi tape) */}
          <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(74,66,56,0.12)] bg-[#f9f0e0] mb-4">
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-5 cd-tape-pink -rotate-1 rounded-xs shadow-xs pointer-events-none z-10"
              aria-hidden="true"
            />
            <img
              src="https://dev.janjiharmoni.id/themes/cute-doodle/2.webp"
              alt={`${groomNickname} & ${brideNickname}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Hand Script: Terima Kasih */}
          <p className="text-[38px] sm:text-[44px] font-hand text-[#cc3a63] -rotate-3 select-none">
            Terima kasih
          </p>

          <p className="text-[13px] text-[#524348] max-w-[340px] leading-relaxed mt-2 font-sans">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.
          </p>

          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#2b2620] font-heading mt-4">
            {groomNickname} &amp; {brideNickname}
          </h2>

          <p className="text-[13px] font-semibold text-[#7a7065] mt-0.5">
            {weddingDate}
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. FOOTER (CLEAN DOODLE BRANDING)                            */}
      {/* ============================================================ */}
      <footer id="footer" className="w-full px-4 pt-6 pb-28 flex flex-col items-center text-center">
        <img
          src={DOODLE_ASSETS.heartArrow}
          alt=""
          aria-hidden="true"
          className="w-12 h-12 object-contain mb-2 animate-doodle-slow"
        />

        <p className="text-[16px] font-bold text-[#cc3a63] font-heading tracking-wide">
          #{groomNickname}&amp;{brideNickname}
        </p>

        <p className="text-[12.5px] font-medium text-[#524348] mt-1">
          {groomNickname} &amp; {brideNickname} Wedding Celebration
        </p>

        <span className="text-[11.5px] text-[#7a7065] mt-1 block">
          Dibuat dengan cinta, coretan doodle &amp; senyuman
        </span>

        <div className="mt-3">
          <div className="px-3.5 py-1 rounded-full bg-[#f9f0e0] text-[11px] font-medium text-[#7a7065] shadow-2xs select-none">
            Dibuat sendiri oleh Fadly 💖
          </div>
        </div>
      </footer>
    </div>
  );
};
