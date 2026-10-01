import React from 'react';
import { CoupleData } from '../types';
import { DoodleGiftBox } from './DoodleIcons';
import { DoodleScatter } from './DoodleScatter';

interface ClosingSectionProps {
  couple?: CoupleData;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ couple }) => {
  const groomNickname = couple?.groom.nickname || 'Arga';
  const brideNickname = couple?.bride.nickname || 'Kirana';
  const weddingDate = couple?.weddingDate || 'Minggu, 14 Februari 2027';

  return (
    <div className="mobile-snap-section w-full flex flex-col items-center select-none justify-center px-4 py-6 relative isolate overflow-hidden">
      <DoodleScatter seed="closing" prefer={['weddingCake', 'doves', 'wineGlasses', 'heartBalloons']} />
      {/* ============================================================ */}
      {/* 1. CLOSING SECTION                                           */}
      {/* ============================================================ */}
      <section
        id="closing"
        aria-label="Penutup"
        className="w-full max-w-[400px] flex flex-col items-center justify-center text-center relative my-auto animate-doodle-in"
      >
        {/* Kept to two fonts: the hand-drawn display face for the one headline,
            Plus Jakarta Sans for everything else. */}
        <div className="w-full flex flex-col items-center relative z-20">
          <div className="mb-3">
            <DoodleGiftBox className="w-14 sm:w-16 h-auto" />
          </div>

          <h2 className="font-delicious text-[40px] sm:text-[44px] text-[#181818] uppercase tracking-wide leading-none">
            Terima Kasih
          </h2>

          <p className="text-[12.5px] text-stone-700 max-w-[320px] leading-relaxed mt-3">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          </p>

          <p className="mt-4 text-[17px] font-bold text-[#B4533C] tracking-wide">
            {groomNickname} &amp; {brideNickname}
          </p>
          <p className="text-[11.5px] font-medium text-stone-500 mt-0.5">
            {weddingDate}
          </p>

          {/* Footer card */}
          <div className="w-full rounded-[24px] bg-[#EBD9A0] border-[2px] border-[#181818] shadow-[5px_5px_0px_#181818] px-5 py-4 mt-6 flex flex-col items-center text-center">
            <span className="px-3 py-0.5 rounded-full bg-white border-[1.5px] border-[#181818] text-[11px] font-bold text-[#181818]">
              #{groomNickname}&amp;{brideNickname}
            </span>
            <p className="mt-2.5 text-[13px] font-semibold text-[#181818] leading-relaxed max-w-[280px]">
              Dibuat oleh Fadly dan Anna dengan cinta dan senyuman, juga teknologi sih hehe
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
